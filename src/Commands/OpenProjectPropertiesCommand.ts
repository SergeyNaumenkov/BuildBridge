import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { DOMParser, XMLSerializer } from 'xmldom';
import { SolutionItem } from '../Models/SolutionItem';
import { VcxProjectEditor } from '../Services/VcxProjectEditor';

interface Property {
    tag: string;
    value: string;
}

interface Section {
    name: string;
    condition?: string;
    properties: Property[];
}

function extractNodes(node: Element, properties: Property[]) {
    for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i] as Element;
        if (child.nodeType !== 1) continue; // только Element ноды

        if (child.childNodes.length === 1 && child.childNodes[0].nodeType === 3) {
            // Текстовая нода — это значение
            properties.push({ tag: child.tagName, value: child.textContent ?? '' });
        } else {
            // Вложенный элемент — рекурсия
            extractNodes(child, properties);
        }
    }
}

let currentWebView: vscode.WebviewPanel | undefined;

async function openProperties(context: vscode.ExtensionContext, item: SolutionItem) {
    const content = await fs.promises.readFile(item.filePath, 'utf-8');
    const dom = new DOMParser().parseFromString(content, 'text/xml');

    const groupTags = ['PropertyGroup', 'ItemDefinitionGroup'];

    // Итоговая структура
    const result: {
        globals: Property[],
        configs: Record<string, Property[]>  // 'Debug|x64' -> properties
    } = {
        globals: [],
        configs: {}
    };

    for (const groupTag of groupTags) {
        const groups = dom.getElementsByTagName(groupTag);

        for (let i = 0; i < groups.length; i++) {
            const group = groups[i];
            const condition = group.getAttribute('Condition')?.replace(/&apos;/g, "'") ?? '';

            const properties: Property[] = [];
            extractNodes(group, properties);

            if (properties.length === 0) continue;

            if (!condition) {
                result.globals.push(...properties);
            } else {
                const match = condition.match(/==\s*'([^']+)'/);
                const configKey = match ? match[1] : condition; // 'Debug|x64'

                if (!result.configs[configKey]) {
                    result.configs[configKey] = [];
                }
                result.configs[configKey].push(...properties);
            }
        }
    }

    if (currentWebView) {
        currentWebView.reveal();
        currentWebView.webview.html = '';
    }
    else {
        currentWebView = vscode.window.createWebviewPanel(
            'projectProperties',        // id
            'Project Properties',       // заголовок
            vscode.ViewColumn.One,      // колонка
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(context.extensionUri, 'media')
                ]
            }
        );
    }

    const mediaUri = currentWebView.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'media', 'WebView/Vcxproj')
    );

    let html = await fs.promises.readFile(
        path.join(context.extensionPath, 'media', 'WebView/Vcxproj/Index.html'), 'utf-8'
    );

    html = html.replace(/src="(?!http)/g, `src="${mediaUri}/`);
    html = html.replace(/href="(?!http)/g, `href="${mediaUri}/`);
    currentWebView.webview.html = html;

    const projectName = path.basename(item.filePath);
    currentWebView.webview.onDidReceiveMessage((message) => {
        if (message.type === 'ready') {
            if (!currentWebView) {
                return;
            }

            currentWebView.webview.postMessage(
                {
                    type: 'loadProject',
                    data: {
                        ProjectName: projectName,
                        data: result
                    }
                }
            );
        }
        else if (message.type === 'saveChanges') {
            const data = message.data;
            const editor = new VcxProjectEditor();
            editor.AddOrChangeProp(item.filePath, data);
        }
        else if (message.type === 'forcedCloseWebView') {
            if (!currentWebView) {
                return;
            }

            currentWebView.dispose();
        }
    });

    currentWebView.onDidDispose(() => {
        currentWebView = undefined;
    });
}

export async function RegisterOpenProjectPropertiesCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('buildbridge.project.properties', async (item: SolutionItem) => {
            await openProperties(context, item);
        })
    );
}
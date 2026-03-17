import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { CreateProjectInfo } from '../Models/ICreateProjectInfo';
import { CreateConsoleApplicationFromWebView } from '../Generator/cpp/ConsoleApplication';
import { GenerateSharedLibrary } from '../Generator/cpp/SharedLibrary';
import { GenerateDynamicLibrary } from '../Generator/cpp/DynamicLibrary';

async function createProjectWebView(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'CreateProjectWebView',        // id
        'Create Project view WebView',       // заголовок
        vscode.ViewColumn.One,      // колонка
        {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(context.extensionUri, 'media')
            ]
        }
    );

    let html = await fs.promises.readFile(
        path.join(context.extensionPath, 'media', 'WebView/CreateProject/index.html'), 'utf-8'
    );

    const mediaUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'media', 'WebView/CreateProject')
    );

    html = html.replace(/src="(?!http)/g, `src="${mediaUri}/`);
    html = html.replace(/href="(?!http)/g, `href="${mediaUri}/`);
    panel.webview.html = html;

    // callback
    panel.webview.onDidReceiveMessage((message) => {
        if (message.type === 'ready') {
            const workspaceFolder = vscode.workspace.workspaceFolders;
            if (!workspaceFolder)
                return;

            const workPath = workspaceFolder[0].uri.fsPath;
            panel.webview.postMessage(
                {
                    type: 'ProjectDetails',
                    data: {
                        WorkspaceFolder: workPath
                    }
                }
            );
        }
        else if (message.type === 'createProject') {
            const data = message.data;
            const internalCommand = data.internalCommand;

            if (internalCommand === 'Create_Console_Application') {
                CreateConsoleApplicationFromWebView(context, data);
            }
            else if (internalCommand === 'Create_Dynamic_Library') {
                GenerateDynamicLibrary(context, data);
            }
            else if (internalCommand === 'Create_Shared_Library') {
                GenerateSharedLibrary(context, data);
            }

            panel.dispose();
        }
    });
}

export async function CreateProjectViaWebView(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('buildbridge.cpp.CreateProjectWeb', async () => {
            await createProjectWebView(context);
        })
    );
}
import * as vscode from 'vscode';
import { ReturnCurrentExtensionVersion } from '../Utils/ExtensionVersion';

class BuildBridgeInfoProvider implements vscode.WebviewViewProvider {
    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = `
    <style>
        body { 
            font-family: var(--vscode-font-family);
            font-size: 16px;
            color: var(--vscode-descriptionForeground);
            padding: 6px 12px;
            margin: 0;
        }
        a { 
            color: var(--vscode-textLink-foreground); 
            text-decoration: none; 
        }
        a:hover { text-decoration: underline; }
        .divider {
            height: 1px;
            background: #434343;
            margin: 6px 0;
        }
        .row { 
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 2px 0;
        }
        .version {
        }
    </style>
    <div class="divider"></div>
    <div class="row">
        <span class="version">BuildBridge: ${ReturnCurrentExtensionVersion()}</span>
    </div>
    <div class="divider"></div>
    <div class="row">
        🐛 <a href="https://github.com/SergeyNaumenkov/BuildBridge/issues">Report an issue</a>
    </div>
    <div class="row">
        🔄 <a href="https://github.com/SergeyNaumenkov/BuildBridge/blob/main/CHANGELOG.md">ChangeLog</a>
    </div>
    <div class="row">
        ⭐ <a href="https://github.com/SergeyNaumenkov/BuildBridge">GitHub</a>
    </div>
`;
    }
}

export function RegisterWebPanelWithInformation(context: vscode.ExtensionContext) {
    vscode.window.registerWebviewViewProvider('buildbridge-info', new BuildBridgeInfoProvider());
}
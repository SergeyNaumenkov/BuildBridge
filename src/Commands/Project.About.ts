import * as vscode from 'vscode';

export function RegisterProjectAboutCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('buildbridge.about', async () => {
            const panel = vscode.window.createWebviewPanel(
                'buildbridge.about',
                'About Build Bridge',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );

            panel.webview.html = `
				<!DOCTYPE html>
				<html>
				<body>
					<h1>Build Bridge</h1>
					<p>Version 1.0.0</p>
					<p>C++ Project Manager for VS Code</p>
				</body>
				</html>
			`;
        })
    );
}
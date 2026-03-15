import * as vscode from 'vscode';

export function RegisterStatusBarMenu(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('buildbridge.showMenu', async () => {
            const selection = await vscode.window.showQuickPick([
                {
                    label: "$(file-code) New C++ Project",
                    description: "Create new console application",
                    command: "buildbridge.cpp.CreateConsoleApplication"
                },
                {
                    label: "$(folder-opened) Open project",
                    description: "Open existing project",
                    command: "buildbridge.openProject"
                },
                {
                    label: "$(settings) Change MSBuild Path",
                    description: "Update MSBuild executable location",
                    command: "buildbridge.changeMSBuildPath"
                },
                {
                    label: "$(info) About",
                    description: "Show extension info",
                    command: "buildbridge.about"
                }
            ], {
                placeHolder: "Choose action...",
                matchOnDescription: true
            });

            if (selection) {
                vscode.commands.executeCommand(selection.command);
            }
        })
    );
}
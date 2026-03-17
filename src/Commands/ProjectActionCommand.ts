import * as vscode from 'vscode';

/* 
    Run project with active debugger
*/
export function RegisterRunProjectWithDebugger(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('buildbridge.project.run', async () => {
            vscode.commands.executeCommand('workbench.action.debug.start');
        })
    );
}

/* 
    Run project with without debugger
*/
export function RegisterRunProjectWithoutDebugger(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('buildbridge.project.run_no_debug', async () => {
            vscode.commands.executeCommand('workbench.action.debug.run');
        })
    );
}

/* 
    Run project with without debugger
*/
export function RegisterBuildProject(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('buildbridge.project.build', async () => {
            vscode.commands.executeCommand('workbench.action.tasks.build');
        })
    );
}
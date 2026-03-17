import * as vscode from 'vscode';
import { SolutionItem } from '../Models/SolutionItem';
import { VcxProjectEditor } from '../Services/VcxProjectEditor';
import path from 'path/win32';

async function RemoveFileFromVcxProject(workspaceFolder: vscode.Uri, outFile: string) {
    const editor = new VcxProjectEditor();
    const files = await vscode.workspace.fs.readDirectory(workspaceFolder);
    const vcxprojFile = files.find(([name, type]) =>
        type === vscode.FileType.File && name.endsWith('.vcxproj')
    );
    if (!vcxprojFile) {
        return;
    }

    const vcxprojPath = path.join(workspaceFolder.fsPath, vcxprojFile[0]);
    await editor.RemoveFile(vcxprojPath, outFile);
}

// Register command for delete files in BuildBridge View panel
export function RegisterProjectFileDeleteCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('buildbridge.project.file.delete', async (item: SolutionItem) => {

            const isMustDelete = await vscode.window.showQuickPick(['Yes', 'No'], {
                prompt: "Do you really want to delete this file?"
            });

            if (isMustDelete === 'Yes') {
                vscode.workspace.fs.delete(vscode.Uri.file(item.filePath));
                vscode.window.showInformationMessage(`File ${item.filePath} was deleted!`);

                const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri;
                if (!workspaceFolder) {
                    console.log('Select project folder!');
                    return;
                }

                const targetFolder = vscode.Uri.file(path.dirname(item.filePath));
                RemoveFileFromVcxProject(targetFolder, item.filePath);
            }
        })
    );
}
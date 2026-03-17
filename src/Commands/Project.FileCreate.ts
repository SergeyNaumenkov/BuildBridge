import * as vscode from 'vscode';
import * as path from 'path';
import { VcxProjectEditor } from '../Services/VcxProjectEditor';
import { SolutionItem } from '../Models/SolutionItem';

async function AddFileToVcxProject(workspaceFolder: vscode.Uri, outFile: string) {
    const editor = new VcxProjectEditor();
    const files = await vscode.workspace.fs.readDirectory(workspaceFolder);
    const vcxprojFile = files.find(([name, type]) =>
        type === vscode.FileType.File && name.endsWith('.vcxproj')
    );
    if (!vcxprojFile) {
        return;
    }

    const vcxprojPath = path.join(workspaceFolder.fsPath, vcxprojFile[0]);
    await editor.AddFile(vcxprojPath, outFile);
}

export function RegisterCreateProjectFileCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('buildbridge.newFile', async (item?: SolutionItem) => {

            const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri;
            if (!workspaceFolder) {
                console.log('Select project folder!');
                return;
            }

            const fileType = await vscode.window.showQuickPick(['.cpp(source file)', '.h(header file)'], {
                prompt: 'Choose file type'
            });

            if (!fileType) {
                console.log("Choose file type!");
                return;
            }

            const fileName = await vscode.window.showInputBox({
                prompt: 'Enter file name'
            });

            if (!fileName) {
                console.log('Enter file name!');
                return;
            }

            let targetFolder: vscode.Uri | null = null;
            if (item && item.filePath) {
                targetFolder = vscode.Uri.file(path.dirname(item.filePath));
                console.log('target: ', targetFolder);
            }
            if (targetFolder === null) {
                return;
            }

            if (fileType === '.cpp(source file)') {
                const outFile = path.join(targetFolder.fsPath, fileName + '.cpp');
                vscode.workspace.fs.writeFile(
                    vscode.Uri.file(outFile),
                    Buffer.from('')
                );

                // Register new file in .vcxproject
                AddFileToVcxProject(targetFolder, outFile);
            }
            else if (fileType === '.h(header file)') {
                const outFile = path.join(targetFolder.fsPath, fileName + '.h');
                vscode.workspace.fs.writeFile(
                    vscode.Uri.file(outFile),
                    Buffer.from('')
                );

                // Register new file in .vcxproject
                AddFileToVcxProject(targetFolder, outFile);
            }
        })
    );
}
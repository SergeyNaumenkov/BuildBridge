import * as vscode from 'vscode';
import { SolutionTreeProvider } from '../Providers/SolutionTreeProvider';

export class ViewFileWatcher {
    private _Watcher: vscode.FileSystemWatcher;
    private _SolutionTreeProvider: SolutionTreeProvider;

    constructor(solutionProvider: SolutionTreeProvider) {
        this._Watcher = vscode.workspace.createFileSystemWatcher('**/*');
        this._SolutionTreeProvider = solutionProvider;
    }

    // Called when file is created in workspace folder
    RegisterOnFileCreate(): void {
        this._Watcher.onDidCreate((uri) => {
            this._SolutionTreeProvider.refresh();
        });
    }

    // Called when file is deleted in workspace folder
    RegisterOnFileDelete(): void {
        this._Watcher.onDidDelete((uri) => {
            this._SolutionTreeProvider.refresh();
        });
    }

    // Called when file is changed in workspace folder
    RegisterOnFileChange(): void {
        /* this._Watcher.onDidChange((uri) => {
            console.log('✏️ Файл изменен:', uri.fsPath);
            this._SolutionTreeProvider.refresh();
        }); */
    }

    // Register in VsCode context
    RegisterInContext(context: vscode.ExtensionContext): void{
        context.subscriptions.push(this._Watcher);
    }
}
import * as vscode from 'vscode';

export class SolutionItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly type: string,
        public readonly filePath: string
    ) {
        super(label, collapsibleState);
        this.contextValue = type;
        this.tooltip = filePath;

        if (type === 'solution') {
            this.iconPath = new vscode.ThemeIcon('project');
        } else if (type === 'project') {
            this.iconPath = new vscode.ThemeIcon('symbol-file');
        }

        if (filePath && collapsibleState === vscode.TreeItemCollapsibleState.None) {
            this.command = {
                command: 'vscode.open',
                title: 'Open File',
                arguments: [
                    vscode.Uri.file(filePath),
                    {
                        preserveFocus: true,
                        preview: true
                    }
                ]
            };
        }
    }
}
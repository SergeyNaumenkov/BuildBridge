import * as vscode from 'vscode';

export class GlobalProjectStatusBar {
    private static instance: GlobalProjectStatusBar;
    private GlobalStatusBar: vscode.StatusBarItem | null = null;

    public Create(context: vscode.ExtensionContext) {
        if(this.GlobalStatusBar)
        {
            return;
        }

        this.GlobalStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this.GlobalStatusBar.command = 'buildbridge.selectConfig';
        this.GlobalStatusBar.text = 'Select configuration';
        this.GlobalStatusBar.show();
        context.subscriptions.push(this.GlobalStatusBar);
    }

    UpdateText(text:string)
    {
        if(!this.GlobalStatusBar)
        {
            return;
        }

        this.GlobalStatusBar.text = text;
    }

    static getInstance(): GlobalProjectStatusBar {
        if (!GlobalProjectStatusBar.instance) {
            GlobalProjectStatusBar.instance = new GlobalProjectStatusBar();
        }
        return GlobalProjectStatusBar.instance;
    }
}
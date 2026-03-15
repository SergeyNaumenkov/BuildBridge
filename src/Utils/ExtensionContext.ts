import * as vscode from 'vscode';

export class ExtensionContext{
    private static _extensionPath: vscode.Uri;

    public static Init(uri: vscode.Uri)
    {
        this._extensionPath = uri;
    }

    public static GetPathToMediaFolder()
    {
        return vscode.Uri.joinPath(this._extensionPath, 'media');
    }
}
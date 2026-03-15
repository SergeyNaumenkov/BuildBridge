import * as vscode from 'vscode';
import * as fs from 'fs';

export async function CheckMSBuild(context: vscode.ExtensionContext) {
    const path = context.globalState.get<string>('MSBuildPath');
    if (!path) {
        let userPath = await vscode.window.showInputBox(
            {
                prompt: 'Please, enter the path to MSBuild.exe'
            }
        );

         if(userPath?.includes('\"'))
        {
            userPath = userPath?.replaceAll('\"','');
        }

        if (!userPath || !fs.existsSync(userPath)) {
            vscode.window.showErrorMessage('Failed create project, because MSBuild is not found!');
            return null;
        }
        context.globalState.update('MSBuildPath', userPath);
        return userPath;
    }

    return path;
}

export async function CheckCompiler(context: vscode.ExtensionContext)
{
    const path = context.globalState.get<string>('CompilerPath');
    if(!path)
    {
        let userPath = await vscode.window.showInputBox(
            {
                prompt: 'Please, enter the path to MS cl.exe'
            }
        );

        if(userPath?.includes('\"'))
        {
            userPath = userPath?.replaceAll('\"','');
        }

        if(!userPath || !fs.existsSync(userPath))
        {
            vscode.window.showErrorMessage('Failed create project, because MS compiler (cl.exe) is not found!');
            return null;
        }

        context.globalState.update('CompilerPath', userPath);
        return userPath;
    }

    return path;
}
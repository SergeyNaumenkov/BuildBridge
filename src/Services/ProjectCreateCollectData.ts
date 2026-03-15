import * as vscode from 'vscode';
import * as fs from 'fs';

import { UserCollectedProjectInformation } from '../Models/IProjectInformation';

export async function CollectDataForCreatingProject() {
    // Collect project name
    const projectName = await vscode.window.showInputBox({
        prompt: 'Enter project name',
        placeHolder: 'Console application name'
    });

    if (!projectName) {
        vscode.window.showErrorMessage("You must enter the project name!");
        return undefined;
    }

    // Collect project platform
    const platform = await vscode.window.showQuickPick(['x64', 'x86', 'both'], {
        placeHolder: 'Select platform type'
    });

    if (!platform) {
        vscode.window.showErrorMessage("You must enter the project platform!");
        return undefined;
    }

    // Collect project configuration
    const configuration = await vscode.window.showQuickPick(['Debug', 'Release', 'both'], {
        placeHolder: 'Select configuration'
    });

    if (!configuration) {
        vscode.window.showErrorMessage("You must enter the project configuration!");
        return undefined;
    }

    // Get Build system type
    const buildSystem = await vscode.window.showQuickPick(['MSBuild', 'CMake'], {
        placeHolder: 'Select build system'
    });

    if (!buildSystem) {
        vscode.window.showErrorMessage("You must enter the project build system!");
        return undefined;
    }

    const collectedInformation: UserCollectedProjectInformation = {
        ProjectType: "ConsoleApplication",
        ProjectName: projectName,
        ProjectPlatform: platform,
        ProjectConfiguration: configuration,
        ProjectBuildSystem: buildSystem,
        MSBuildPath: '',
        MSCompilerPath: ''
    };

    return collectedInformation;
}
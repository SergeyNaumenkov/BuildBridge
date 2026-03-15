import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { ProjectSession } from '../Models/LocalProjectSession';
import { GlobalProjectStatusBar } from '../Services/GlobalStatusBarService';

function UpdateVsCodeBuildFolder(selectedConfig: string, selectedPlatform: string) {

    // Update tasks.json
    const workspaceFolder = vscode.workspace.workspaceFolders![0].uri.fsPath;
    const tasksPath = path.join(workspaceFolder, '.vscode', 'tasks.json');

    if (fs.existsSync(tasksPath)) {
        const content = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));

        content.tasks.forEach((task: any) => {
            task.group.isDefault = task.label === `MSBuild ${selectedPlatform} ${selectedConfig}`;
        });

        fs.writeFileSync(tasksPath, JSON.stringify(content, null, 4));
    }
}

export function RegisterProjectSelectConfigurationCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('buildbridge.selectConfig', async () => {
            const session = ProjectSession.getInstance();
            const configs = session.availableConfigs;
            const platforms = session.availablePlatforms;

            const selectedConfig = await vscode.window.showQuickPick(configs, {
                placeHolder: 'Select configuration'
            });

            const selectedPlatform = await vscode.window.showQuickPick(platforms, {
                placeHolder: 'Select platform'
            });

            if (!selectedConfig) { return; }
            if (!selectedPlatform) { return; }

            session.activeConfig = selectedConfig;
            session.activePlatform = selectedPlatform;

            UpdateVsCodeBuildFolder(selectedConfig, selectedPlatform);

            GlobalProjectStatusBar.getInstance().UpdateText(`$(gear) ${selectedConfig} | ${selectedPlatform}`);
        })
    );
}
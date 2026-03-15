import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { UserCollectedProjectInformation } from "../Models/IProjectInformation";
import { GetProjectPlatformAndConfiguration, UnMapPlatform } from './Utils/GeneratorUtils';

export class BuildBridgeConfig {
    async GenerateConfig(workspaceFolder: string, data: UserCollectedProjectInformation, startupProject: string, solutionPath: string) {

        const BuildBridgePath = path.join(workspaceFolder, '.BuildBridge');
        vscode.workspace.fs.createDirectory(vscode.Uri.file(BuildBridgePath));

        const { configs, platforms } = GetProjectPlatformAndConfiguration(data);

        const json = {
            Name: `${data.ProjectName}`,
            Type: 'MsBuild',
            Created: `${new Date().toLocaleString()}`,
            SolutionPath: solutionPath,
            StartUpProject: startupProject,
            Build: [
                {
                    Configuration: configs,
                    Platforms: platforms.map(UnMapPlatform)
                }
            ],
            MSBuildPath: `${data.MSBuildPath}`
        };

        await vscode.workspace.fs.writeFile(
            vscode.Uri.joinPath(vscode.Uri.file(BuildBridgePath), 'config.json'),
            Buffer.from(JSON.stringify(json, null, 4))
        );
    }

    async UpdateProjectConfiguration(configs: string[], platforms: string[]) {

    }

    GetPropValue(workspaceFolder: string, propName: string) {
        const BuildBridgePath = path.join(workspaceFolder, '.BuildBridge');
        const file = path.join(BuildBridgePath, 'config.json');
        if (!fs.existsSync(file))
            return '';

        const content = fs.readFileSync(file, 'utf-8');
        const json = JSON.parse(content);

        return json[propName];
    }

    GetParentPropValue(workspaceFolder: string, parent: string, propName: string) {
        const BuildBridgePath = path.join(workspaceFolder, '.BuildBridge');
        const file = path.join(BuildBridgePath, 'config.json');
        if (!fs.existsSync(file))
            return '';

        const content = fs.readFileSync(file, 'utf-8');
        const json = JSON.parse(content);

        return json[parent][0][propName];
    }
}
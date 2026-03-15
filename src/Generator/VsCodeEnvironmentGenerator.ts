import * as vscode from 'vscode';
import * as path from 'path';

import { UserCollectedProjectInformation } from "../Models/IProjectInformation";
import { GetProjectPlatformAndConfiguration, UnMapPlatform } from './Utils/GeneratorUtils';


export class VsCodeEnvironmentGenerator {
    async StartGenerate(workspaceFolder: vscode.WorkspaceFolder, data: UserCollectedProjectInformation) {
        const vscodeBuildFolder = vscode.Uri.joinPath(workspaceFolder.uri, '.vscode');
        vscode.workspace.fs.createDirectory(vscodeBuildFolder);

        // get platform and config
        const { configs, platforms } = GetProjectPlatformAndConfiguration(data);

        // Generate tasks.json
        this.GenerateTasksJson(configs, platforms, vscodeBuildFolder, data);

        // Generate Settings.json
        this.GenerateSettingsJson(vscodeBuildFolder);

        // Generate Launch.json
        this.GenerateLaunchJson(vscodeBuildFolder);

        // Generate cpp props json
        this.GenerateCPPPropsJson(vscodeBuildFolder, data, configs, platforms);
    }

    async GenerateFromExistProject(configs: string[], platforms: string[], vscodePath: string, slnxPath: string, data: UserCollectedProjectInformation, cwd: string | null = null) {

        // Create .vscode folder
        vscodePath = path.join(vscodePath, '.vscode');
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(vscodePath));

        this.GenerateTasksJson(configs, platforms, vscode.Uri.file(vscodePath), data, true);
        this.GenerateSettingsJson(vscode.Uri.file(vscodePath));
        this.GenerateLaunchJson(vscode.Uri.file(vscodePath), cwd);
        this.GenerateCPPPropsJson(vscode.Uri.file(vscodePath), data, configs, platforms);
    }

    private GenerateTasksJson(configs: string[], platforms: string[], vscodePath: vscode.Uri, data: UserCollectedProjectInformation, isFromSlnx: boolean = false) {

        let projectName = data.ProjectName;
        projectName += '.slnx';

        /* json for task */
        const tasks = {
            version: '2.0.0',
            tasks: configs.flatMap(config =>
                platforms.map(platform => ({
                    label: `MSBuild ${UnMapPlatform(platform)} ${config}`,
                    type: "shell",
                    command: data.MSBuildPath,
                    args: [
                        `\${workspaceFolder}/${projectName}`,
                        `/p:Configuration=${config}`,
                        `/p:Platform=${UnMapPlatform(platform)}`,
                        "/m"
                    ],
                    group: { kind: "build", isDefault: false },
                    problemMatcher: "$msCompile"
                }))
            )
        };

        /* Set first task is default */
        if (tasks.tasks.length > 0) {
            tasks.tasks[0].group.isDefault = true;
        }

        vscode.workspace.fs.writeFile(
            vscode.Uri.joinPath(vscodePath, 'tasks.json'),
            Buffer.from(JSON.stringify(tasks, null, 4), 'utf8')
        );
    }

    private GenerateSettingsJson(vscodePath: vscode.Uri) {
        // Create Settings.json
        const json = {
            'debug.inlineValues': 'on',
            'debug.openDebug': 'neverOpen'
        };

        vscode.workspace.fs.writeFile(
            vscode.Uri.joinPath(vscodePath, 'settings.json'),
            Buffer.from(JSON.stringify(json, null, 4), 'utf8')
        );
    }

    private GenerateLaunchJson(path: vscode.Uri, overloadWorkspaceFolder: string | null = null) {
        const json = {
            version: '0.2.0',
            configurations: [
                {
                    name: 'Launch Build',
                    type: 'cppvsdbg',
                    request: 'launch',
                    program: '${command:buildbridge.getExePath}',
                    cwd: overloadWorkspaceFolder ? `${overloadWorkspaceFolder}` : `\${workspaceFolder}/`,
                    preLaunchTask: '${command:buildbridge.getBuildTask}'
                }
            ]
        };

        /* Write */
        vscode.workspace.fs.writeFile(
            vscode.Uri.joinPath(path, 'launch.json'),
            Buffer.from(JSON.stringify(json, null, 4), 'utf8')
        );
    }

    private GenerateCPPPropsJson(vscodePath: vscode.Uri, data: UserCollectedProjectInformation, configs: string[], platforms: string[]) {
        const configurations = configs.flatMap(config =>
            platforms.map(platform => ({
                name: `${config} ${platform}`,
                includePath: ['${workspaceFolder}/**'],
                defines: config === 'Debug'
                    ? ['_DEBUG', 'UNICODE', '_UNICODE']
                    : ['NDEBUG', 'UNICODE', '_UNICODE'],
                windowsSdkVersion: '10.0.26100.0',
                compilerPath: `${data.MSCompilerPath}`,
                cStandard: 'c17',
                cppStandard: 'c++23',
                intelliSenseMode: platform === 'x64' ? 'windows-msvc-x64' : 'windows-msvc-x86'
            }))
        );

        const json = {
            configurations,
            version: 4
        };

        vscode.workspace.fs.writeFile(
            vscode.Uri.joinPath(vscodePath, 'c_cpp_properties.json'),
            Buffer.from(JSON.stringify(json, null, 4), 'utf8')
        );
    }
}
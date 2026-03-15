import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DOMParser } from 'xmldom';

import { VsCodeEnvironmentGenerator } from '../Generator/VsCodeEnvironmentGenerator';
import { CheckCompiler, CheckMSBuild } from '../Utils/MSBuildLocator';
import { UserCollectedProjectInformation } from '../Models/IProjectInformation';
import { BuildBridgeConfig } from '../Generator/BuildBridgeConfig';
import { ProjectSession } from '../Models/LocalProjectSession';
import { SolutionTreeProvider } from '../Providers/SolutionTreeProvider';

function ExtractVcxProjects(workspaceFolder: string, slnxPath: string) {
    const content = fs.readFileSync(slnxPath, 'utf-8');
    const dom = new DOMParser().parseFromString(content, 'text/xml');

    const projects = dom.getElementsByTagName('Project');
    const vcxprojPaths: string[] = [];

    for (let i = 0; i < projects.length; i++) {
        const projectPath = projects[i].getAttribute('Path');
        if (projectPath) {
            // Резолвим относительный путь
            const fullVcxPath = path.join(workspaceFolder, projectPath);
            vcxprojPaths.push(fullVcxPath);
        }
    }

    return vcxprojPaths;
}

function ParseVcxProj(pathToProject: string) {
    try {
        const content = fs.readFileSync(pathToProject, 'utf-8');
        const dom = new DOMParser().parseFromString(content, 'text/xml');

        const ProjectData: { Configurations: string[], Platforms: string[] } = {
            Configurations: [],
            Platforms: [],
        };

        const itemGroup = dom.getElementsByTagName('ProjectConfiguration');
        if (itemGroup) {
            for (let i = 0; i < itemGroup.length; i++) {
                const config = itemGroup[i].getElementsByTagName('Configuration')[0]?.textContent;
                const platform = itemGroup[i].getElementsByTagName('Platform')[0]?.textContent;

                if (!ProjectData.Configurations.includes(config)) {
                    ProjectData.Configurations.push(config);
                }

                if (!ProjectData.Platforms.includes(platform)) {
                    ProjectData.Platforms.push(platform);
                }
            }
        }

        return ProjectData;
    } catch {
        return null;
    }
}

function TryWorkingDirectoryFromProject(pathToProject: string) {
    try {
        const content = fs.readFileSync(pathToProject + '.user', 'utf-8').replace(/^\uFEFF/, '');
        const dom = new DOMParser().parseFromString(content, 'text/xml');
        const groups = dom.getElementsByTagName('PropertyGroup');
        for (let i = 0; i < groups.length; i++) {
            const cwd = groups[i].getElementsByTagName('LocalDebuggerWorkingDirectory')[0]?.textContent;
            if (cwd) return cwd;
        }
    } catch {
        return null;
    }
}

export function RegisterOpenProjectCommand(context: vscode.ExtensionContext, treeDataProvider: SolutionTreeProvider) {
    context.subscriptions.push(
        vscode.commands.registerCommand('buildbridge.cpp.OpenProject', async () => {
            const workspaceFolder = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'Select project folder'
            });

            if (!workspaceFolder)
                return;

            // Try find .slnx
            let files: string[] = [];
            try {
                files = fs.readdirSync(workspaceFolder[0].fsPath);
            } catch {
                return;
            }
            const solution = files.find(f => f.endsWith('.slnx'));
            if (solution) {
                const fullPath = path.join(workspaceFolder[0].fsPath, solution);
                const projects = ExtractVcxProjects(workspaceFolder[0].fsPath, fullPath);
                if (projects.length === 0) {
                    return;
                }

                // Update Custom Project View
                treeDataProvider.LoadProject(workspaceFolder[0].fsPath);

                /* Check folders */
                const rootPath = workspaceFolder[0].fsPath;
                const vscodeFolder = path.join(rootPath, '.vscode');
                if (!fs.existsSync(vscodeFolder)) {

                    // Generate .vscode folder
                    console.log('.vscode folder is not found! Try generate this folder!');

                    const data = ParseVcxProj(projects[0]);
                    if (!data) {
                        return;
                    }

                    const userLookProjects = projects.map(p => path.basename(p/* , '.vcxproj' */));

                    let startupProject = await vscode.window.showQuickPick(userLookProjects, {
                        prompt: 'Choose startup project'
                    });

                    if (!startupProject)
                        return;

                    const vscodeData = new VsCodeEnvironmentGenerator();
                    const msBuildPath = await CheckMSBuild(context);
                    const compilerPath = await CheckCompiler(context);
                    if (!msBuildPath || !compilerPath) {
                        return;
                    }

                    const collectedData: UserCollectedProjectInformation = {
                        ProjectType: 'ConsoleApplication',
                        ProjectName: path.basename(fullPath, '.slnx'),
                        ProjectPlatform: '',
                        ProjectConfiguration: '',
                        ProjectBuildSystem: 'MSBuild',
                        MSBuildPath: msBuildPath,
                        MSCompilerPath: compilerPath
                    };

                    const selectedIndex = userLookProjects.indexOf(startupProject);
                    const startupProjectFullPath = projects[selectedIndex]

                    const cwd = TryWorkingDirectoryFromProject(startupProjectFullPath);
                    let resolvedCwd: string | null = null;
                    if (cwd) {
                        const vcxDir = path.dirname(startupProjectFullPath);
                        resolvedCwd = path.resolve(vcxDir, cwd);
                    }
                    vscodeData.GenerateFromExistProject(data.Configurations, data.Platforms, rootPath, fullPath, collectedData, resolvedCwd);

                    const configBuilder = new BuildBridgeConfig();
                    configBuilder.GenerateConfig(rootPath, collectedData, startupProjectFullPath, fullPath);
                }
                else {
                    const configBuilder = new BuildBridgeConfig();
                    const proj = configBuilder.GetPropValue(workspaceFolder[0].fsPath, 'StartUpProject');
                    if (proj) {
                        ProjectSession.getInstance().vcxprojPath = proj;
                    }

                    ProjectSession.getInstance().solutionFilePath = fullPath;
                }
            }
            else {
                vscode.window.showErrorMessage('.slnx File Is Not found! folder is not loaded!');
            }

            vscode.commands.executeCommand('vscode.openFolder', workspaceFolder[0]);
        })
    );
}
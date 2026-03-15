
import * as vscode from 'vscode';
import * as fs from 'fs';

import { CreateProjectInfo } from '../../Models/ICreateProjectInfo';
import { UserCollectedProjectInformation } from '../../Models/IProjectInformation';
import { VcxprojGenerator } from './VcxprojGenerator';
import { VsCodeEnvironmentGenerator } from '../VsCodeEnvironmentGenerator';
import { SolutionGenerator } from './SolutionGenerator';
import { BuildBridgeConfig } from '../BuildBridgeConfig';
import { CollectDataForCreatingProject } from '../../Services/ProjectCreateCollectData';
import { CheckCompiler, CheckMSBuild } from '../../Utils/MSBuildLocator';
import { ProjectSession } from '../../Models/LocalProjectSession';
import { ProjectTemplateName } from '../../Types/ProjectTemplateType';

/* Create console application which creating from WebView */
export async function CreateConsoleApplicationFromWebView(context: vscode.ExtensionContext, data: CreateProjectInfo) {
    const collectedData: UserCollectedProjectInformation = {
        ProjectType: 'ConsoleApplication',
        ProjectName: data.name,
        ProjectPlatform: data.platform,
        ProjectConfiguration: data.configuration,
        ProjectBuildSystem: data.buildSystem,
        MSBuildPath: '',
        MSCompilerPath: ''
    };

    // Get msbuild path from vscode context storage
    if (collectedData.ProjectBuildSystem === 'MSBuild') {
        const path = await CheckMSBuild(context);
        if (!path) {
            return;
        }
        collectedData.MSBuildPath = path;

        const compilerPath = await CheckCompiler(context);
        if (!compilerPath) {
            return;
        }

        collectedData.MSCompilerPath = compilerPath;
    }

    return CreateConsoleApp(collectedData);
}

function IsSolutionFound(workspaceFolder: string): string {
    const files = fs.readdirSync(workspaceFolder);
    const slnx = files.find(f => f.endsWith('.slnx'));
    if (slnx) {
        // Found
        return slnx;
    }

    // Not found, create new
    return '';
}

/* Shared function for create Console Application */
async function CreateConsoleApp(collectedData: UserCollectedProjectInformation) {

    const workspaceFolder = vscode.workspace.workspaceFolders;
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('For create project Your must be open a folder!');
        return false;
    }

    /* Generate .vcxproj file */
    const vcxProjGenerator = new VcxprojGenerator();
    vcxProjGenerator.LoadFromTemplate(ProjectTemplateName.ConsoleApplication, collectedData, workspaceFolder[0].uri.fsPath);

    /* Generate solution for this project */
    const uuid = vcxProjGenerator.GetProjectUUID();

    /* Create solution file */
    const slnxGenerator = new SolutionGenerator();
    const solutionPath = IsSolutionFound(workspaceFolder[0].uri.fsPath);
    if (solutionPath !== '') {
        slnxGenerator.AddProjectToExistSolution(workspaceFolder[0].uri.fsPath, solutionPath, collectedData.ProjectName, uuid);
    }
    else {
        await slnxGenerator.StartGenerate(workspaceFolder[0].uri.fsPath, uuid, collectedData);

        /* Generate .vscode folder for compiling and launching the project */
        const vsCodeEnv = new VsCodeEnvironmentGenerator();
        await vsCodeEnv.StartGenerate(workspaceFolder[0], collectedData);

        /* Generate Build Bridge config */
        const extConfig = new BuildBridgeConfig();
        const vcxprojPath = vcxProjGenerator.GetProjectPath();
        const slnxPath = slnxGenerator.GetFilePath();
        await extConfig.GenerateConfig(workspaceFolder[0].uri.fsPath, collectedData, vcxprojPath, slnxPath);

        // Save current project as Startup
        ProjectSession.getInstance().vcxprojPath = vcxprojPath;
        ProjectSession.getInstance().exePaths = ''; // Reset cached executable file

        const { configs, platforms } = vcxProjGenerator.GetProjectConfigurations();
        ProjectSession.getInstance().availableConfigs = configs;
        ProjectSession.getInstance().availablePlatforms = platforms;
        ProjectSession.getInstance().solutionFilePath = slnxPath;
    }

    return true;
}

/* Create application from VsCode inputs */
export async function CreateConsoleApplication(context: vscode.ExtensionContext) {

    // Collect data from user 
    const collectedData = await CollectDataForCreatingProject();
    if (!collectedData) {
        return false;
    }

    // Get msbuild path from vscode context storage
    if (collectedData.ProjectBuildSystem === 'MSBuild') {
        const path = await CheckMSBuild(context);
        if (!path) {
            return;
        }
        collectedData.MSBuildPath = path;
    }

    return CreateConsoleApp(collectedData);
}
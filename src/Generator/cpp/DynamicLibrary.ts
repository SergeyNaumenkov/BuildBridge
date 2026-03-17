import * as vscode from 'vscode';
import { CreateProjectInfo } from '../../Models/ICreateProjectInfo';
import { UserCollectedProjectInformation } from '../../Models/IProjectInformation';
import { CheckCompiler, CheckMSBuild } from '../../Utils/MSBuildLocator';
import { VcxprojGenerator } from './VcxprojGenerator';
import { ProjectTemplateName } from '../../Types/ProjectTemplateType';
import { SolutionGenerator } from './SolutionGenerator';
import { IsSolutionFound } from '../Utils/GeneratorUtils';
import { VsCodeEnvironmentGenerator } from '../VsCodeEnvironmentGenerator';
import { BuildBridgeConfig } from '../BuildBridgeConfig';
import { ProjectSession } from '../../Models/LocalProjectSession';

/* 
    Generate dynamic library (.dll)
    This code copied from 'ConsoleApplication'
    Need re-write and make one model for creating project templates
*/
export async function GenerateDynamicLibrary(context: vscode.ExtensionContext, data: CreateProjectInfo) {
    const collectedData: UserCollectedProjectInformation = {
        ProjectType: 'Dyamic library (.dll)',
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

    await CreateDyamicLibraryFromTemplate(collectedData);
}


async function CreateDyamicLibraryFromTemplate(collectedData: UserCollectedProjectInformation) {
    const workspaceFolder = vscode.workspace.workspaceFolders;
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('For create project Your must be open a folder!');
        return false;
    }

    /* Generate .vcxproj file */
    const vcxProjGenerator = new VcxprojGenerator();
    vcxProjGenerator.LoadFromTemplate(ProjectTemplateName.DynamicLibrary, collectedData, workspaceFolder[0].uri.fsPath);

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

        /* Generate .vscode folder for compile and launch the project */
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
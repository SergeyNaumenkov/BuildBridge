import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { RegisterProjectFileDeleteCommand } from './Commands/Project.FileDelete';
import { RegisterCreateProjectFileCommand } from './Commands/Project.FileCreate';
import { RegisterCreateConsoleAppCommand } from './Commands/CreateConsoleAppCommand';
import { RegisterStatusBarMenu } from './Commands/Project.StatusBar.Menu';
import { RegisterProjectAboutCommand } from './Commands/Project.About';

import { SolutionTreeProvider } from './Providers/SolutionTreeProvider';

import { ViewFileWatcher } from './Services/FileSystem';
import { CreateProjectViaWebView } from './Commands/CreateProjectWebViewCommand';
import { RegisterOpenProjectPropertiesCommand } from './Commands/OpenProjectPropertiesCommand';
import { BuildBridgeConfig } from './Generator/BuildBridgeConfig';
import { RegisterProjectSelectConfigurationCommand } from './Commands/ProjectSelectConfigurationCommand';
import { ProjectSession } from './Models/LocalProjectSession';
import { RegisterOpenProjectCommand } from './Commands/OpenProjectCommand';
import { RegisterGetProjectBuildTask } from './Commands/ProjectGetBuildTaskCommand';
import { RegisterProjectGetStartupFileCommand } from './Commands/ProjectGetStartupFileCommand';
import { GlobalProjectStatusBar } from './Services/GlobalStatusBarService';
import { ExtractVcxProjects, ParseVcxProj } from './Utils/VcxprojUtils';
import { ExtensionContext } from './Utils/ExtensionContext';

function RegisterAllCommands(context: vscode.ExtensionContext) {
	RegisterCreateProjectFileCommand(context);
	RegisterProjectFileDeleteCommand(context);
	RegisterProjectAboutCommand(context);
	RegisterStatusBarMenu(context);
 }

async function GetCurrentProjectConfiguration() {
	const folder = vscode.workspace.workspaceFolders![0].uri.fsPath;
	const session = ProjectSession.getInstance();
	
	// Try load config file
	const configPath = path.join(folder, '.BuildBridge');
	if (fs.existsSync(configPath)) {
		const cfg = new BuildBridgeConfig();
		const solutionPath = cfg.GetPropValue(folder, "SolutionPath");
		const startupProject = cfg.GetPropValue(folder, "StartUpProject");
		const configurations = cfg.GetParentPropValue(folder, "Build", "Configuration");
		const platfroms = cfg.GetParentPropValue(folder, "Build", "Platforms");

		// Update session data
		session.solutionFilePath = solutionPath;
		session.vcxprojPath = startupProject;
		session.availableConfigs = configurations;
		session.availablePlatforms = platfroms;

		session.activeConfig = configurations[0];
		session.activePlatform = platfroms[0];
	}
	else {
		const files = fs.readdirSync(folder);
		const solution = files.find(f => f.endsWith('.slnx'));

		if (solution) {
			const fullPath = path.join(folder, solution);
			const projects = ExtractVcxProjects(folder, fullPath);
			const data = ParseVcxProj(projects[0]);

			// Update session data
			session.availablePlatforms = data.Platforms;
			session.availableConfigs = data.Configurations;
			session.activeConfig = data.Configurations[0];
			session.activePlatform = data.Platforms[0];
		}
	}

	// Update status bar
	GlobalProjectStatusBar.getInstance().UpdateText(`$(gear) ${session.activeConfig} | ${session.activePlatform}`);
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Build Bridge enabled!');

	// Get extension path
	ExtensionContext.Init(context.extensionUri);

	// Create Provider
	const treeDataProvider = new SolutionTreeProvider();

	const treeView = vscode.window.createTreeView('buildbridge-projects', {
		treeDataProvider: treeDataProvider,
		showCollapseAll: true
	});

	// Create watcher for view panel
	const watcher = new ViewFileWatcher(treeDataProvider);
	watcher.RegisterOnFileCreate();
	watcher.RegisterOnFileDelete();
	watcher.RegisterOnFileChange();
	watcher.RegisterInContext(context);

	GlobalProjectStatusBar.getInstance().Create(context);

	// Register command for choosing the project configuration
	RegisterProjectSelectConfigurationCommand(context);

	RegisterOpenProjectCommand(context, treeDataProvider);

	RegisterGetProjectBuildTask(context);

	RegisterProjectGetStartupFileCommand(context);

	// Register all commands
	RegisterAllCommands(context);

	// Register command for create Console Application
	RegisterCreateConsoleAppCommand(context, treeDataProvider);

	// Register command for create projects from WebView
	CreateProjectViaWebView(context);

	// Register command for viewing the props of project via WebView
	RegisterOpenProjectPropertiesCommand(context);

	GetCurrentProjectConfiguration();
}

export function deactivate() { }
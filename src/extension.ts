/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	extension.ts
 * Date		Created: 20.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Entry point file for extension
 *****************************************************************************/

import * as vscode from 'vscode';
import * as path from 'path';

/* Utils */
import { Logger } from './Utils/Logger';

/* Managers */
import { SolutionManager } from './Core/Managers/SolutionManager';
import { ProjectManager } from './Core/Managers/ProjectManager';
import { SolutionTreeProvider } from './UI/TreeView/SolutionTreeProvider';
import { TreeViewDataModel } from './Types/TreeViewSolutionData';
import { IProject } from './Models/Interfaces/IProject';
import { ISolution } from './Models/Interfaces/ISolution';
import { PathUtils } from './Utils/Strings/PathUtils';
import { TreeViewSolutionDataBuilder } from './Core/TreeView/TreeViewSolutionBuilder';

/* 
	Entry point
*/
export async function activate(context: vscode.ExtensionContext) {
	Logger.LogToOutput('=========== Extension is activate! =========== ');

	/* test */
	const workspaceFolder = vscode.workspace.workspaceFolders;
	if (!workspaceFolder) {
		return;
	}

	const workspace = workspaceFolder[0].uri.fsPath;
	const solutionManager = new SolutionManager();
	const solution = await solutionManager.Load(workspace + '\\FPSGame.slnx');



	/*
	THIS CODE FOR TEST PARSERS
	THIS CODE BASED ON MY LOCAL PROJECTS 
	*/
	let projects: IProject[] = [];
	const vsProjectManager = new ProjectManager();
	for (const project of solution.projects) {
		const fullPath = workspace + '\\' + project.path;
		const projectData = await vsProjectManager.Load(fullPath);

		projects.push(projectData);
	}

	const viewData = new TreeViewSolutionDataBuilder();
	const viewSolutionData = viewData.Build(solution, projects);

	/* Register our View Tree Data Provider */
	const provider = new SolutionTreeProvider();
	provider.LoadData(viewSolutionData);
	vscode.window.registerTreeDataProvider('buildbridge-solution-container-id', provider);
}

export function deactivate() { }
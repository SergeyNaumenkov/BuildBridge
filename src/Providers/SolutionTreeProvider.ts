import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { DOMParser, XMLSerializer } from 'xmldom';
import { SolutionItem } from '../Models/SolutionItem';

export class SolutionTreeProvider implements vscode.TreeDataProvider<SolutionItem> {

	private _onDidChangeTreeData = new vscode.EventEmitter<SolutionItem | undefined | null>();
	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
	private projectRootPath: string | null = null;

	getTreeItem(element: SolutionItem): vscode.TreeItem {
		return element;
	}

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	LoadProject(rootPath: string) {
		this.projectRootPath = rootPath;
		this.refresh();
	}

	async getChildren(element?: SolutionItem): Promise<SolutionItem[]> {
		const workspaceFolder = this.projectRootPath ?? vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
		if (!workspaceFolder) {
			return [];
		}

		if (!element) {
			return this.getSolutionFiles(workspaceFolder);
		}

		let elementType = element.contextValue;
		if (elementType === 'solution') {
			const slnxPath = path.join(element.filePath, element.label as string);
			return this.GetVcxprojects(slnxPath);
		}

		elementType = element.contextValue;
		if (elementType === 'project') {
			return this.GetSourceFiles(path.dirname(element.filePath));
		}

		return [];
	}

	private async getSolutionFiles(rootPath: string): Promise<SolutionItem[]> {
		const files = await fs.promises.readdir(rootPath);
		const solutions = files.filter(f => f.endsWith('.slnx'));

		return solutions.map(sln => new SolutionItem(
			sln,
			vscode.TreeItemCollapsibleState.Expanded,
			'solution',
			rootPath
		));
	}

	private async GetVcxprojects(slnxPath: string): Promise<SolutionItem[]> {
		const content = fs.readFileSync(slnxPath, 'utf-8');
		const dom = new DOMParser().parseFromString(content, 'text/xml');
		const projects = dom.getElementsByTagName('Project');
		const rootPath = path.dirname(slnxPath);

		const items: SolutionItem[] = [];
		for (let i = 0; i < projects.length; i++) {
			const projectPath = projects[i].getAttribute('Path');
			if (projectPath) {
				const fullPath = path.join(rootPath, projectPath);
				items.push(new SolutionItem(
					path.basename(projectPath),
					vscode.TreeItemCollapsibleState.Collapsed,
					'project',
					fullPath
				));
			}
		}
		return items;
	}

	private async GetSourceFiles(rootPath: string): Promise<SolutionItem[]> {
		const files = await fs.promises.readdir(rootPath);
		const source = files.filter(f =>
			f.endsWith('.cpp') ||
			f.endsWith('.cxx') ||
			f.endsWith('.h'));

		return source.map(src => {
			const item = new SolutionItem(
				src,
				vscode.TreeItemCollapsibleState.None,
				'source',
				rootPath + '\\' + src
			);

			if (src.endsWith('.cpp') || src.endsWith('.cxx')) {
				item.iconPath = new vscode.ThemeIcon('file-code');
				item.contextValue = 'cpp';
			} else if (src.endsWith('.h') || src.endsWith('.hpp')) {
				item.iconPath = new vscode.ThemeIcon('file-code');
				item.contextValue = 'header';  // или 'h'
			}

			return item;
		});
	}
}
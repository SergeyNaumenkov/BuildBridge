/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	SolutionTreeProvider.ts
 * Date		Created: 21.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		View Tree Solution Item.
 *****************************************************************************/

import * as vscode from 'vscode';
import { ViewTreeSolutionItem } from './SolutionTreeItem';
import { TreeViewSolutionData } from '../../Types/SolutionViewTree/TreeViewSolutionData';

export class SolutionTreeProvider implements vscode.TreeDataProvider<ViewTreeSolutionItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<ViewTreeSolutionItem | undefined>;
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
    private _solutionTreeViewData: TreeViewSolutionData | undefined = undefined;

    public LoadData(data: TreeViewSolutionData) {
        this._solutionTreeViewData = data;
    }

    /**
        Get tree element
    */
    getTreeItem(element: ViewTreeSolutionItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    /**
        Get children of parent item
    */
    getChildren(element?: ViewTreeSolutionItem | undefined): vscode.ProviderResult<ViewTreeSolutionItem[]> {
        /* Create root element */
        if (!element) {
            return this.createRootElement();
        }

        if (element.type === 'Solution') {
            return this.createProjectNodes(element);
        }

        if (element.type === 'project') {
            return this.createProjectFilesNode(element);
        }

        if (element.type === 'folder') {
            return this.createFolderFilesNode(element);
        }

        return [];
    }

    public refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }

    /**
        Get parent
    */
    getParent?(element: ViewTreeSolutionItem): vscode.ProviderResult<ViewTreeSolutionItem> {
        throw new Error('Method not implemented.');
    }

    resolveTreeItem?(item: vscode.TreeItem, element: ViewTreeSolutionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
        throw new Error('Method not implemented.');
    }


    /**
     * helper functions 
    */
    private createRootElement(): vscode.ProviderResult<ViewTreeSolutionItem[]> {
        return [new ViewTreeSolutionItem(
            this._solutionTreeViewData!.SolutionName,
            vscode.TreeItemCollapsibleState.Collapsed,
            'Solution',
            this._solutionTreeViewData!.Solution.path
        )];
    }

    private createProjectNodes(element?: ViewTreeSolutionItem | undefined): vscode.ProviderResult<ViewTreeSolutionItem[]> {
        return this._solutionTreeViewData!.Projects.map(p =>
            new ViewTreeSolutionItem(
                p.name,
                vscode.TreeItemCollapsibleState.Collapsed,
                'project',
                p.path
            )
        );
    }

    private createProjectFilesNode(element: ViewTreeSolutionItem): vscode.ProviderResult<ViewTreeSolutionItem[]> {
        const project = this._solutionTreeViewData!.Projects.find(p => p.name === element.label);
        if (!project) return [];

        const folders = new Set(
            project.sourceFiles
                .filter(f => f.folderName)
                .map(f => f.folderName!)
        );

        const items: ViewTreeSolutionItem[] = [];

        // Folders
        for (const folder of folders) {
            items.push(new ViewTreeSolutionItem(
                folder,
                vscode.TreeItemCollapsibleState.Collapsed,
                'folder',
                undefined,
                project.name
            ));
        }

        //  Files in root
        project.sourceFiles
            .filter(f => !f.folderName)
            .forEach(f => items.push(new ViewTreeSolutionItem(
                f.name,
                vscode.TreeItemCollapsibleState.None,
                f.type === '.cpp' ? 'cpp' : 'header',
                f.path
            )));

        return items;
    }

    private createFolderFilesNode(element: ViewTreeSolutionItem): vscode.ProviderResult<ViewTreeSolutionItem[]> {
        const project = this._solutionTreeViewData!.Projects.find(p => p.name === element.parentProject);
        if (!project) return [];

        return project.sourceFiles
            .filter(f => f.folderName === element.label)
            .map(f => new ViewTreeSolutionItem(
                f.name,
                vscode.TreeItemCollapsibleState.None,
                f.type === '.cpp' ? 'cpp' : 'header',
                f.path
            ));
    }
}
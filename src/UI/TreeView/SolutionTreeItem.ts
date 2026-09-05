/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	SolutionTreeItem.ts
 * Date		Created: 21.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		View Tree Solution Item.
 *****************************************************************************/

import path from 'path';
import * as vscode from 'vscode';

export class ViewTreeSolutionItem extends vscode.TreeItem {

    constructor(public readonly label: string,
        public readonly collapsableState: vscode.TreeItemCollapsibleState,
        public readonly type: string,
        public readonly description?: string,
        public readonly parentProject?: string,
        public readonly parentSolution?: string) {

        /* Call parent constructor */
        super(label, collapsableState);

        this.contextValue = type;
        this.tooltip = description;

        const iconsPath = path.join(__filename, '..', '..', '..', '..', 'media', 'icons');
        if (type === 'test') {
            /*  this.iconPath = {
                 light: vscode.Uri.file(path.join(iconsPath, 'slnx_dark.svg')),
                 dark: vscode.Uri.file(path.join(iconsPath, 'slnx_dark.svg'))
             }; */
            this.iconPath = new vscode.ThemeIcon('folder');
        }
        else if (type === 'project') {
            this.iconPath = new vscode.ThemeIcon('folder');
        }
        else {
            this.iconPath = new vscode.ThemeIcon('folder');
        }
    }
};
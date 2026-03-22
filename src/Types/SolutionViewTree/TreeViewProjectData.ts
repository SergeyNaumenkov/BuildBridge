/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	TreeViewSourceFiles.ts
 * Date		Created: 22.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Type for describs of project data for View Tree data
 *****************************************************************************/

import { TreeViewSourceFile } from "./TreeViewSourceFiles";

export type TreeViewProjectData = {
    name: string;
    path: string;
    configurations: {
        configs: string[];
        platforms: string[];
    };
    sourceFiles: TreeViewSourceFile[];
};
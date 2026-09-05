/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	TreeViewSourceFiles.ts
 * Date		Created: 22.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Type for describs of Source files for View Tree data
 *****************************************************************************/

export type TreeViewSourceFile = {
    name: string;
    path: string;
    type: string;
    folderName?: string;
};
/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	TreeViewSourceFiles.ts
 * Date		Created: 22.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Type for describs of project solution data for View Tree data
 *****************************************************************************/

import { ISolution } from "../../Models/Interfaces/ISolution"
import { TreeViewProjectData } from "./TreeViewProjectData"

export type TreeViewSolutionData = {
    Solution: ISolution,
    SolutionName: string,
    Projects: TreeViewProjectData[]
}
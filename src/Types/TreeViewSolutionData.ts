/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	TreeViewSolutionData.ts
 * Date		Created: 21.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Model for data used in Tree View Data
 *****************************************************************************/

import { IProject } from "../Models/Interfaces/IProject";
import { ISolution } from "../Models/Interfaces/ISolution";

export type TreeViewDataModel = {
    Solution: ISolution,
    SolutionProjects: IProject[]
};
/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	IProjectManager.ts
 * Date		Created: 20.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Shared interface for all projects
 *****************************************************************************/

import { IProject } from "./IProject";

export interface IProjectManager {
    /** 
        Load project by path
    */
    Load(filePath: string): Promise<IProject>;

};
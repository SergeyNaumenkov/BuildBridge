/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	ISolution.ts
 * Date		Created: 20.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Shared interface for all solutions
 *****************************************************************************/

import { ISolutionProject } from "./ISolutionProject";

export interface ISolution {
    /* 
        Solution file name
    */
    name: string;

    /* 
        Path to solution file
    */
    path: string;

    /* 
        Solution format
    */
    format: 'slnx' | 'sln';

    /* 
        Solution projects
    */
    projects: ISolutionProject[];
}
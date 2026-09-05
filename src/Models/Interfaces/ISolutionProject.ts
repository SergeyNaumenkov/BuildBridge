/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	ISolutionProject.ts
 * Date		Created: 20.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Shared interface for parsed solution projects
 *****************************************************************************/

export interface ISolutionProject {
    /* 
        Project name
    */
    name: string;

    /* 
         Path to project
    */
    path: string;

    /* 
        Project UUID
    */
    uuid: string;
}
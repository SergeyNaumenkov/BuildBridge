/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	IProject.ts
 * Date		Created: 20.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Shared interface for all types projects
 *****************************************************************************/

import { IConfiguration } from "./IConfiguration";
import { ISourceFile } from "./ISourceFile";

export interface IProject {
    // Name of project
    name: string;

    // Path to project
    path: string;

    // Format of project (.vcXproj or .vcproj)
    format: 'vcxproj' | 'vcproj';

    // Project configuration
    configurations: IConfiguration[];

    // Source files included in project
    sourceFiles: ISourceFile[];
}
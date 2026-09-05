/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	IProjetParser.ts
 * Date		Created: 20.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Shared interface for all project parsers
 *****************************************************************************/

import { IProject } from "./IProject";

export interface IProjectParser {
    // Check if this parser can handle the file
    CanParse(filePath: string): boolean;

    // Parse project file and return IProject model
    Parse(filePath: string): Promise<IProject>;
};
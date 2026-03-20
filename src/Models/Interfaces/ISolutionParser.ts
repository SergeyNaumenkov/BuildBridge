/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	ISolutionParser.ts
 * Date		Created: 20.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Shared interface for all solution parsers
 *****************************************************************************/

import { ISolution } from "./ISolution";
import { ISolutionProject } from "./ISolutionProject";

export interface ISolutionParser {
    /* 
        Check if parse the file 
    */
    CanParse(filePath: string): boolean;

    /* 
        Parse file
    */
    Parse(filePath: string): Promise<ISolution>;
};
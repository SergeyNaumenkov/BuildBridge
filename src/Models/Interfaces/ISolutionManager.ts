/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	ISolutionManager.ts
 * Date		Created: 20.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Shared interface for all solution managers
 *****************************************************************************/

import { ISolution } from "./ISolution";

export interface ISolutionManager {
    /* 
       Load file by path and parse it
    */
    Load(filePath: string): Promise<ISolution>;
}
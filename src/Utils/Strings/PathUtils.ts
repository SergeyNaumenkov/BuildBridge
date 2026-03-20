/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	PathUtils.ts
 * Date		Created: 20.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Utils for internal path class
 *****************************************************************************/

import * as path from 'path';

export class PathUtils {
    /** 
        Get file name without path
    */
    static GetFileName(filePath: string): string {
        return path.basename(filePath);
    }

    /**  
        Remove extensiton
    */
    static RemoveExtension(file: string): string {
        return path.parse(file).name;
    }

    /**
     Get file extension
    */
   static GetFileExtension(file: string): string{
    return path.extname(file);
   }
}
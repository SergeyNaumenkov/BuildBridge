/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	FileSystem.ts
 * Date		Created: 20.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Wrapper for ts file system
 *****************************************************************************/

import * as fs from 'fs';

export class FileSystem {
    /** 
        Check is file exists by path
    */
    static IsExist(file: string): boolean {
        return fs.existsSync(file);
    }

    /**
        Read file and get content 
    */
    static async Read(file: string): Promise<string> {
        if (!this.IsExist(file)) {
            return '';
        }

        return await fs.promises.readFile(file, 'utf-8');
    }
}
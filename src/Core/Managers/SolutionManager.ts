/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	SlnxManager.ts
 * Date		Created: 20.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Manager of .slnx files
 *****************************************************************************/

import { ISolution } from "../../Models/Interfaces/ISolution";
import { ISolutionManager } from "../../Models/Interfaces/ISolutionManager";
import { ISolutionParser } from "../../Models/Interfaces/ISolutionParser";
import { SlnxParser } from "../Parsers/SlnxParser";

export class SolutionManager implements ISolutionManager {
    private parsers: ISolutionParser[] = [
        new SlnxParser()
    ];


    /* 
        Load solution file 
        and return parsed solution data
    */
    async Load(filePath: string): Promise<ISolution> {
        const parser = this.getParser(filePath);
        return parser.Parse(filePath);
    }

    /* 
        Utils functions
    */
    private getParser(filePath: string): ISolutionParser {
        const parser = this.parsers.find(p => p.CanParse(filePath));
        if (!parser) {
            throw new Error(`No parser found for ${filePath}`);
        }

        return parser;
    }
};
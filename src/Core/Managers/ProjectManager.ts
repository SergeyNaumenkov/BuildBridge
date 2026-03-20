/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	ProjectManager.ts
 * Date		Created: 20.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Shared project manager implements IProjectManager 
 *****************************************************************************/

import { VcxprojParser } from "../Parsers/VcxprojParser";

import { IProject } from "../../Models/Interfaces/IProject";
import { IProjectManager } from "../../Models/Interfaces/IProjectManager";
import { IProjectParser } from "../../Models/Interfaces/IProjectParser";

export class ProjectManager implements IProjectManager {
    private parsers: IProjectParser[] = [
        new VcxprojParser()
    ];

    /**
        Load and get parsed IProject data
     */
    async Load(filePath: string): Promise<IProject> {
        const parser = this.getParser(filePath);
        return parser.Parse(filePath);
    }

    /* 
            Utils functions
        */
    private getParser(filePath: string): IProjectParser {
        const parser = this.parsers.find(p => p.CanParse(filePath));
        if (!parser) {
            throw new Error(`No parser found for ${filePath}`);
        }

        return parser;
    }

};
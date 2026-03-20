/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	SolutionXParser.ts
 * Date		Created: 20.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Parser .slnx file
 *****************************************************************************/

import { DOMParser } from 'xmldom';

import { ISolution } from "../../Models/Interfaces/ISolution";
import { ISolutionParser } from "../../Models/Interfaces/ISolutionParser";
import { ISolutionProject } from '../../Models/Interfaces/ISolutionProject';

import { FileSystem } from '../../Utils/FileSystem/FileSystem';
import { PathUtils } from '../../Utils/Strings/PathUtils';

export class SlnxParser implements ISolutionParser {
    CanParse(filePath: string): boolean {
        return filePath.endsWith('.slnx');
    }

    async Parse(filePath: string): Promise<ISolution> {
        if (!FileSystem.IsExist(filePath)) {
            throw new Error(`Solution file ${filePath} is not exist!`);
        }

        /* Read file */
        const fileContent = await FileSystem.Read(filePath);

        /* Get file name */
        let fileName = PathUtils.RemoveExtension(PathUtils.GetFileName(filePath));

        /* Get solution projects */
        const projects = this.extractProjects(fileContent);

        return {
            name: fileName,
            path: filePath,
            format: 'slnx',
            projects: projects
        };
    }

    /* 
        Extract projects from solution file
    */
    private extractProjects(fileContent: string): ISolutionProject[] {

        // get xml dom
        const dom = new DOMParser().parseFromString(fileContent, 'text/xml');

        // get project node
        const projectNodes = dom.getElementsByTagName('Project');

        const projects: ISolutionProject[] = [];
        for (let i = 0; i < projectNodes.length; i++) {
            // Get 'project' node
            const node = projectNodes[i];

            // Get path
            const path = node.getAttribute('Path');

            // Get uuid 
            const uuid = node.getAttribute('Id');

            if (path && uuid) {
                // Get file name without path
                const fileName = PathUtils.RemoveExtension(PathUtils.GetFileName(path));

                projects.push({
                    name: fileName,
                    path: path,
                    uuid: uuid
                });
            }
        }

        return projects;
    }

};
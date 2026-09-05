/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	VcxprojParser.ts
 * Date		Created: 20.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Parser for .vcXproj file
 *****************************************************************************/

import { DOMParser } from 'xmldom';

import { IConfiguration } from "../../Models/Interfaces/IConfiguration";
import { IProject } from "../../Models/Interfaces/IProject";
import { IProjectParser } from "../../Models/Interfaces/IProjectParser";
import { ISourceFile } from "../../Models/Interfaces/ISourceFile";

import { FileSystem } from "../../Utils/FileSystem/FileSystem";
import { PathUtils } from "../../Utils/Strings/PathUtils";


export class VcxprojParser implements IProjectParser {
    constructor() {

    }

    CanParse(filePath: string): boolean {
        return filePath.endsWith('.vcxproj');
    }

    async Parse(filePath: string): Promise<IProject> {
        if (!FileSystem.IsExist(filePath)) {
            throw new Error(`VS project file ${filePath} is not exist!`);
        }

        /* Read file */
        const fileContent = await FileSystem.Read(filePath);

        /* Get file name */
        let fileName = PathUtils.RemoveExtension(PathUtils.GetFileName(filePath));

        // get xml dom
        const dom = new DOMParser().parseFromString(fileContent, 'text/xml');

        /* Get project configuration */
        const configurations = this.getProjectConfigurations(dom);

        /* Get project source files */
        const sourceFiles = this.getSourceFiles(dom);

        return {
            name: fileName,
            format: 'vcxproj',
            path: filePath,
            configurations: configurations,
            sourceFiles: sourceFiles
        };
    }

    /** 
        Get project configurations
    */
    private getProjectConfigurations(dom: Document): IConfiguration[] {

        // get project node
        const projectNodes = dom.getElementsByTagName('Project');

        // Get projecConfiguration node
        const projConfigNode = projectNodes[0].getElementsByTagName('ProjectConfiguration');
        if (!projConfigNode) {
            return [];
        }

        const configurations: IConfiguration[] = [];
        for (let i = 0; i < projConfigNode.length; i++) {
            // get configuration label
            const config = projConfigNode[i].getElementsByTagName('Configuration')[0].textContent;

            // get platform label
            const platform = projConfigNode[i].getElementsByTagName('Platform')[0].textContent;

            if (config && platform) {
                configurations.push({
                    label: config,
                    platform: platform
                });
            }
        }

        return configurations;
    }

    /**
     Get all source files from project
    */
    private getSourceFiles(dom: Document): ISourceFile[] {

        // get project node
        const projectNodes = dom.getElementsByTagName('Project');

        // Get source files node
        const sourceNodes = projectNodes[0].getElementsByTagName('ClCompile');
        if (!sourceNodes) {
            return [];
        }

        const sourceFiles: ISourceFile[] = [];

        /* Get source files ( .cpp ) */
        for (let i = 0; i < sourceNodes.length; i++) {
            // get file
            const path = sourceNodes[i].getAttribute('Include');
            if (path) {
                sourceFiles.push({
                    path: path,
                    type: PathUtils.GetFileExtension(PathUtils.GetFileName(path))
                });
            }
        }

        const includeNode = projectNodes[0].getElementsByTagName('ClInclude');
        if (!includeNode) {
            return sourceFiles;
        }

        /* Get include files ( .h ) */
        for (let i = 0; i < includeNode.length; i++) {
            // get file
            const path = includeNode[i].getAttribute('Include');
            if (path) {
                sourceFiles.push({
                    path: path,
                    type: PathUtils.GetFileExtension(PathUtils.GetFileName(path))
                });
            }
        }

        return sourceFiles;
    }
}
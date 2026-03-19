/* 
    Global interface for all types projects
*/

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
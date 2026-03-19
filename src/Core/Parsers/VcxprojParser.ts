/* 
    Parser for .vcXproj file
*/

import { IConfiguration } from "../../Models/Interfaces/IConfiguration";
import { IProject } from "../../Models/Interfaces/IProject";
import { IProjectParser } from "../../Models/Interfaces/IProjectParser";
import { ISourceFile } from "../../Models/Interfaces/ISourceFile";


export class VcxprojParser implements IProjectParser {
    constructor() {

    }
    
    CanParser(filePath: string): boolean {
        throw new Error("Method not implemented.");
    }
    Parse(filePath: string): IProject {
        throw new Error("Method not implemented.");
    }
    AddSourceFile(filePath: string, projectPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    RemoveSourceFile(filePath: string, projectPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    GetSourceFiles(projectPath: string): Promise<ISourceFile[]> {
        throw new Error("Method not implemented.");
    }
    GetConfigurations(projectPath: string): Promise<IConfiguration[]> {
        throw new Error("Method not implemented.");
    }
}
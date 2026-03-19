/* 
    Shared interface for all project parsers
*/

import { IConfiguration } from "./IConfiguration";
import { IProject } from "./IProject";
import { ISourceFile } from "./ISourceFile";

export interface IProjectParser {
    // Check if this parser can handle the file
    CanParser(filePath: string): boolean;

    // Parse project file and return IProject model
    Parse(filePath: string): IProject;

    // Add source file to project
    AddSourceFile(filePath: string, projectPath: string): Promise<void>;

    // Remove source file from project
    RemoveSourceFile(filePath: string, projectPath: string): Promise<void>;

    // Get all source files from project
    GetSourceFiles(projectPath: string): Promise<ISourceFile[]>;

    // Get project configurations
    GetConfigurations(projectPath: string): Promise<IConfiguration[]>;
};
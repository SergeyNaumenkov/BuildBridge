import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { UserCollectedProjectInformation } from "../../Models/IProjectInformation";
import { GetProjectPlatformAndConfiguration, UnMapPlatform } from '../Utils/GeneratorUtils';

export class SolutionGenerator {
    private filePath: string = '';

    async StartGenerate(workspaceFolder: string, uuid: string, data: UserCollectedProjectInformation) {
        const solutionPath = path.join(workspaceFolder, `${data.ProjectName}.slnx`);

        var xml = `<Solution>\n<Configurations>`;
        const filePath = path.join(data.ProjectName, data.ProjectName);

        // get platform and config
        const { configs, platforms } = GetProjectPlatformAndConfiguration(data);
        for (const platform of platforms) {
            xml += `  <Platform Name="${UnMapPlatform(platform)}" /> `;
        }

        xml += '\n';
        xml += '</Configurations>\n';
        xml += `  <Project Path="${filePath}.vcxproj" Id="${uuid}" />\n`;
        xml += '</Solution>';

        this.filePath = solutionPath;

        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(solutionPath),
            Buffer.from(xml)
        );
    }

    public GetFilePath() {
        return this.filePath;
    }

    public AddProjectToExistSolution(workspaceFolder: string, solutionPath: string, projectName: string, uuid: string) {
        const solution = path.join(workspaceFolder, solutionPath);

        let content = fs.readFileSync(solution, 'utf-8');
        const projectEntry = `  <Project Path="${projectName}\\${projectName}.vcxproj" Id="${uuid}" />`;
        content = content.replace('</Solution>', `${projectEntry}\n</Solution>`);
        fs.writeFileSync(solution, content, 'utf-8');

        this.filePath = solution;
    }
}
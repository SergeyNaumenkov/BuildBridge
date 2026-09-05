/*****************************************************************************
 * Copyright (c) 2026 Sergey Naumenkov
 *
 * File:	TreeViewSolutionBuilder.ts
 * Date		Created: 22.03.2026
 * Author:  Sergey Naumenkov
 * License: MIT (see LICENSE file for details)
 *
 * Description:
 *		Helper class for build View Tree Data from parsed projects
 *****************************************************************************/

import path from "path";
import { IProject } from "../../Models/Interfaces/IProject";
import { ISolution } from "../../Models/Interfaces/ISolution";
import { TreeViewProjectData } from "../../Types/SolutionViewTree/TreeViewProjectData";
import { TreeViewSolutionData } from "../../Types/SolutionViewTree/TreeViewSolutionData";
import { TreeViewSourceFile } from "../../Types/SolutionViewTree/TreeViewSourceFiles";
import { PathUtils } from "../../Utils/Strings/PathUtils";

export class TreeViewSolutionDataBuilder {

    /**
          Build projects for Tree view 
    */
    public Build(solution: ISolution, projects: IProject[]): TreeViewSolutionData {
        // initialize view data
        const viewData: TreeViewSolutionData = {
            Solution: solution,
            SolutionName: solution.name,
            Projects: []
        };

        // Build data based on parsed projects
        viewData.Projects = this.BuildProject(projects);

        return viewData;
    }

    /**
          Build projects for Tree view 
    */
    private BuildProject(projects: IProject[]): TreeViewProjectData[] {

        let projectsData: TreeViewProjectData[] = [];

        for (let i = 0; i < projects.length; i++) {
            const pr = projects[i];
            projectsData.push({
                name: pr.name,
                path: pr.path,
                configurations: {
                    configs: pr.configurations.map(p => p.label),
                    platforms: pr.configurations.map(p => p.platform)
                },
                sourceFiles: this.buildSourceFilesFromProject(pr)
            });
        }

        return projectsData;
    }

    /**
          Build source files information based on information from project
    */
    private buildSourceFilesFromProject(project: IProject): TreeViewSourceFile[] {

        const sourceFiles: TreeViewSourceFile[] = [];
        for (let i = 0; i < project.sourceFiles.length; i++) {
            const src = project.sourceFiles[i];

            sourceFiles.push({
                name: PathUtils.GetFileName(src.path),
                path: src.path,
                type: src.type,
                folderName: this.findSubFolder(src.path)
            });
        }

        return sourceFiles;
    }


    /**
          Try get sub folder name
    */
    private findSubFolder(filePath: string): string | undefined {
        let pt = path.dirname(filePath);
        return pt === '.' ? undefined : pt;
    }
}
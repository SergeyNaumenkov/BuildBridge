import * as path from 'path';
import * as fs from 'fs';

export function ExtractVcxProjects(workspaceFolder: string, slnxPath: string) {
    const content = fs.readFileSync(slnxPath, 'utf-8');
    const dom = new DOMParser().parseFromString(content, 'text/xml');

    const projects = dom.getElementsByTagName('Project');
    const vcxprojPaths: string[] = [];

    for (let i = 0; i < projects.length; i++) {
        const projectPath = projects[i].getAttribute('Path');
        if (projectPath) {
            // Резолвим относительный путь
            const fullVcxPath = path.join(workspaceFolder, projectPath);
            vcxprojPaths.push(fullVcxPath);
        }
    }

    return vcxprojPaths;
}

export function ParseVcxProj(pathToProject: string) {
    const content = fs.readFileSync(pathToProject, 'utf-8');
    const dom = new DOMParser().parseFromString(content, 'text/xml');

    const ProjectData: { Configurations: string[], Platforms: string[] } = {
        Configurations: [],
        Platforms: []
    };

    const itemGroup = dom.getElementsByTagName('ProjectConfiguration');
    if (itemGroup) {
        for (let i = 0; i < itemGroup.length; i++) {
            const config = itemGroup[i].getElementsByTagName('Configuration')[0]?.textContent;
            const platform = itemGroup[i].getElementsByTagName('Platform')[0]?.textContent;

            if (!ProjectData.Configurations.includes(config)) {
                ProjectData.Configurations.push(config);
            }

            if (!ProjectData.Platforms.includes(platform)) {
                ProjectData.Platforms.push(platform);
            }
        }
    }

    return ProjectData;
}
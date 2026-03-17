import * as fs from 'fs';
import { UserCollectedProjectInformation } from "../../Models/IProjectInformation";

/* Utils */
export function MapPlatform(platform: string) {
    if (platform === 'x86') {
        return 'Win32';
    }

    return platform;
}

export function UnMapPlatform(platform: string) {
    if (platform === 'Win32') {
        return 'x86';
    }

    return platform;
}

export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function GetProjectPlatformAndConfiguration(projectInfo: UserCollectedProjectInformation) {
    const configSelection: Record<string, string[]> = {
        'Debug': ['Debug'],
        'Release': ['Release'],
        'both': ['Debug', 'Release']
    };

    const platformSelection: Record<string, string[]> = {
        'x64': ['x64'],
        'x86': ['x86'],
        'both': ['x64', 'x86']
    };

    let plats = platformSelection[projectInfo.ProjectPlatform] ?? ['x64', 'x86'];
    plats = plats.map(p => p === 'x86' ? 'Win32' : p);

    return {
        configs: configSelection[projectInfo.ProjectConfiguration] ?? ['Debug', 'Release'],
        platforms: plats
    };
}

export function GetResolvedConfigurations(projectData: UserCollectedProjectInformation): { configs: string[], platforms: string[] } {
    const configs = ['Debug', 'Release'];
    const platforms = ['x64', 'Win32'];

    const resolvedConfigs = projectData.ProjectConfiguration === 'Both' ? configs : [projectData.ProjectConfiguration];
    const resolvedPlatforms = projectData.ProjectPlatform === 'Both' ? platforms : [projectData.ProjectPlatform];

    return { configs: resolvedConfigs, platforms: resolvedPlatforms };
}

export function IsSolutionFound(workspaceFolder: string): string {
    const files = fs.readdirSync(workspaceFolder);
    const slnx = files.find(f => f.endsWith('.slnx'));
    if (slnx) {
        // Found
        return slnx;
    }

    // Not found, create new
    return '';
}
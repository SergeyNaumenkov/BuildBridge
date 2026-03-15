
export class ProjectSession {
    private static instance: ProjectSession;
    private _vcxprojPath: string | null = null;

    activeConfig: string = 'Debug';
    activePlatform: string = 'x64';

    availableConfigs: string[] = [];
    availablePlatforms: string[] = [];
    solutionFilePath: string = '';

    exePaths: string = '';

    get vcxprojPath() { return this._vcxprojPath; }
    set vcxprojPath(value: string | null) {
        this._vcxprojPath = value;
        this.exePaths = ''; 
    }

    static getInstance(): ProjectSession {
        if (!ProjectSession.instance) {
            ProjectSession.instance = new ProjectSession();
        }
        return ProjectSession.instance;
    }
}


function SendDataToVsCode(projectData) {
    console.log('vs code received data: ', projectData);

    const data = {
        name: projectData.projectName,
        platform: projectData.projectPlatform,
        buildSystem: 'MSBuild',
        configuration: projectData.projectConfiguration,
        internalCommand: 'Create_Console_Application'
    };

    // Notify vs code that a project needs to be created
    vscode.postMessage({
        type: 'createProject',
        data: data
    });
}
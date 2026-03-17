
/* 
    Prepare project data and send in vs code
*/
function SendDataToVsCode(projectData, projectType) {
    console.log('vs code received data: ', projectData);

    const data = {
        name: projectData.projectName,
        platform: projectData.projectPlatform,
        buildSystem: 'MSBuild',
        configuration: projectData.projectConfiguration,
        internalCommand: projectType
    };

    // Notify vs code that a project needs to be created
    vscode.postMessage({
        type: 'createProject',
        data: data
    });
}
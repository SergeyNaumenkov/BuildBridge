
let gWorkspaceFolder = '';
function LoadDataFromVsCode() {
    window.addEventListener('message', (event) => {
        const message = event.data;
        if (message.type === 'ProjectDetails') {
            gWorkspaceFolder = message.data.WorkspaceFolder;

            const location = document.getElementById('configurate-project-workspace-folder-for-project-id');
            if(location)
            {
                location.value = gWorkspaceFolder;
            }
        }
    });
}
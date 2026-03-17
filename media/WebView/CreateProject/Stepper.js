
/* Data collector */
function CollectData(pageIndex) {
    if (pageIndex === 2) {
        const projectName = document.getElementById('configurate-project-name-id').value;
        const projectConfiguration = document.getElementById('configurate-project-configure-id').value;
        const projectPlatform = document.getElementById('configurate-project-platform-id').value;
        const projectLanguageStandard = document.getElementById('configurate-project-language-standard-id').value;

        return { projectName, projectConfiguration, projectPlatform, projectLanguageStandard };
    }

    return {};
}

function validatePage(pageIndex) {
    if (pageIndex === 1) {
        const projectName = document.getElementById('configurate-project-name-id').value;

        if (!projectName) {
            return false;
        }

        if (!/^[a-zA-Z0-9_ ]+$/.test(projectName)) {
            return false;
        }
    }
    return true;
}

const FilesToGenerateArrayData = [
    { ID: 'review-to-be-generate-folder-name-id', toReplace: '{$Name$}\\' },
    { ID: 'review-to-be-generate-solution-name-id', toReplace: '{$Name$}.slnx' },
    { ID: 'review-to-be-generate-project-name-id', toReplace: '{$Name$}.vcxproj' },
    { ID: 'review-to-be-generate-cpp-name-id', toReplace: '{$Name$}.cpp' },
];

function GetTemplateByIndex()
{
    if(gCurrentTemplateIndex === 0)
    {
        return 'Console Application';
    }
    else if(gCurrentTemplateIndex === 1)
    {
        return 'Dynamic Library (.dll)';
    }
    else if(gCurrentTemplateIndex === 2)
    {
        return 'Shared Library (.lib)';
    }

    // fix it later
    return 'Custom Template';
}

function fillReviewPage(data) {
    document.getElementById('review-project-name-id').textContent = data.projectName;
    document.getElementById('review-project-configurate-id').textContent = data.projectConfiguration;
    document.getElementById('review-project-platform-id').textContent = data.projectPlatform;
    document.getElementById('review-project-path-id').textContent = gWorkspaceFolder;
    document.getElementById('review-project-cpp-standard-id').textContent = data.projectLanguageStandard;
    document.getElementById('review-card-value-id').textContent = GetTemplateByIndex();

    /*  */
    FilesToGenerateArrayData.forEach(item => {
        const element = document.getElementById(item.ID);
        const textToReplace = item.toReplace.replace('{$Name$}', data.projectName);
        element.textContent = textToReplace;
    });
}

/* Change step */
const steps = ['select-template', 'configure', 'create'];
let currentStep = 0;

function ChangePage(index) {
    document.querySelectorAll('.page').forEach((el, i) => {
        if (i === index) {
            el.classList.remove('page-hidden');
        } else {
            el.classList.add('page-hidden');
        }
    });
}

function ChangeButtonText(text) {
    const btn = document.getElementById('footer-button-next-create-id');
    btn.textContent = text;
}

function ChangeButtonOnClick(func) {
    const btn = document.getElementById('footer-button-next-create-id');
    btn.onclick = func;
}

function ChangeStep() {
    if (currentStep >= steps.length - 1 || gCurrentTemplateIndex === -1) {
        return;
    }

    if (!validatePage(currentStep)) {
        return;
    }

    currentStep++;

    /* collect data from properties */
    /* If last page change button text */
    if (currentStep === steps.length - 1) {
        ChangeButtonText('Create Project');

        const projectData = CollectData(currentStep);
        fillReviewPage(projectData);

        /* Change onclick for button */
        let projectTypeString = '';
        if (gCurrentTemplateIndex === 0) {
            projectTypeString = 'Create_Console_Application';
        }
        else if (gCurrentTemplateIndex === 1) {
            projectTypeString = 'Create_Dynamic_Library';
        }
        else if (gCurrentTemplateIndex === 2) {
            projectTypeString = 'Create_Shared_Library';
        }

        //console.log('Project type:', projectTypeString);
        ChangeButtonOnClick(() => { SendDataToVsCode(projectData, projectTypeString); });
    }

    document.querySelectorAll('.step').forEach((el, index) => {
        el.classList.remove('active', 'done');

        if (index < currentStep) {
            el.classList.add('done');
        } else if (index === currentStep) {
            el.classList.add('active');
            ChangeStepNumber(index);
            ChangePage(index);
        }
    });
}

function PrevStep() {
    if (currentStep <= 0) {
        return;
    }

    currentStep--;

    if (currentStep < steps.length - 1) {
        ChangeButtonText('Next');
    }

    ChangeButtonOnClick(() => { ChangeStep(); });

    document.querySelectorAll('.step').forEach((el, index) => {
        el.classList.remove('active', 'done');

        if (index < currentStep) {
            el.classList.add('done');
        } else if (index === currentStep) {
            el.classList.add('active');
            ChangeStepNumber(index);
            ChangePage(index);
        }
    });
}

function ChangeStepNumber(number) {
    const informer = document.getElementById('footer-step-informer-id');
    const maxSteps = steps.length;

    informer.textContent = `Steps: ${number + 1} of ${maxSteps}`;
}
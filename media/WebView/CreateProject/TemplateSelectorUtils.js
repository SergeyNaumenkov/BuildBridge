
function SetButtonEnableDisabled(state) {
    const btn = document.getElementById('footer-button-next-create-id');

    console.log('button state: ', state);
    if (state === true) {
        btn.classList.add('button-next-disabled');
    }
    else {
        btn.classList.remove('button-next-disabled');
    }
}

let gCurrentTemplateIndex = -1;
function SelectTemplate(index) {
    console.log('selected! with index: ', index);

    document.querySelectorAll('.template-section').forEach((el, i) => {
        el.classList.remove('section-active');
    });

    const section = document.querySelectorAll('.template-section')[index];
    section.classList.add('section-active');

    gCurrentTemplateIndex = index;

    SetButtonEnableDisabled(false);
}

const Templates = [
    {
        TemplateName: 'ConsoleApplication',
        Description: 'A command-line C++ application with main() entry point',
        Icon: '>_',
        Tags: [
            'C++',
            'Windows',
            'Console'
        ]
    },
    {
        TemplateName: 'Dynamic Library (.dll)',
        Description: 'A dynamic library for windows system',
        Icon: 'DLL',
        Tags: [
            'C++',
            'Windows',
            'Library',
            '.dll'
        ]
    },
    {
        TemplateName: 'Static Library (.lib)',
        Description: 'A static library for windows system',
        Icon: 'LIB',
        Tags: [
            'C++',
            'Windows',
            'Library',
            'static',
            '.lib'
        ]
    }
];

function GenerateTemplateFromArray() {
    const container = document.getElementById('template-section-container-id');

    Templates.forEach((template, index) => {
        container.innerHTML +=
            `
        <div class="template-section" onclick='SelectTemplate(${index})' id='template-section-id'>
            <div>
                <p class="template-icon-manual">${template.Icon}</p>
            </div>
                <div class="template-text-section">
                    <p class="template-title">${template.TemplateName}</p>
                    <p class="template-description-text">${template.Description}</p>
                    <div class="templat-tags-group">
                     ${template.Tags.map(tag => `<p class="template-tag">${tag}</p>`).join('')}
                    </div>
                </div>
            </div>
        </div>
        `;
    });



}
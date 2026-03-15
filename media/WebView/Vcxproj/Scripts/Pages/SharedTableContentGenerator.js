
function getProp(ProjectProperties, xmlKey) {
    const configProps = ProjectProperties.Sections.configs?.[ProjectProperties.Configuration] ?? [];
    const globalProps = ProjectProperties.Sections.globals ?? [];

    const fromConfig = configProps.find(p => p.tag === xmlKey)?.value;
    const fromGlobal = globalProps.find(p => p.tag === xmlKey)?.value;

    return fromConfig ?? fromGlobal ?? null;
}

function GenerateControlByType(name, desk, value, xml, xmlParsedValue, locationString, isConfig, control) {
    if (control === undefined) {
        return `
         <input
            class='shared-input'
            type="text" 
            value="${xmlParsedValue}"
            data-key='${xml}'
            data-original='${xmlParsedValue}'
            data-location='${locationString ?? ''}'
            data-isconfig='${isConfig ?? false}'
            />
        `;
    }
    else if (control.Type === 'checkbox') {
        return `
        <div style='display:flex; align-items:center; gap:8px;'>
        <input
            id='${name}'
            type="checkbox" 
            value="${xmlParsedValue}"
            data-key='${xml}'
            data-original='${xmlParsedValue}'
            data-location='${locationString ?? ''}'
            data-isconfig='${isConfig ?? false}'
            ${xmlParsedValue === true || xmlParsedValue === 'true' ? 'checked' : ''}
            />
        <label for='${name}'>${xmlParsedValue}</label>
        </div>
        `;
    }
    else if (control.Type === 'dropdown') {
        return `
        <div>
            <select class='dropdown-base'
            data-key='${xml}'
            data-original='${xmlParsedValue}'
            data-location='${locationString ?? ''}'
            data-isconfig='${isConfig ?? false}'>
                ${control.Values.map(v =>
            `<option 
            ${v === xmlParsedValue ? 'selected' : ''}
            id='${v}'>
            ${v}
            </option>`
        )
    }
            </select >
        </div >
        `;
    }
}

function GenerateTableContent(content, ProjectProperties) {
    // Clear previous items
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    /* Change page title */
    const pageTitle = document.getElementById('Page_Title');
    pageTitle.innerHTML = content.title;

    /* Generate */
    content.fields.forEach(([name, desk, value, xml, location, isConfig, control]) => {
        const xmlParsedValue = getProp(ProjectProperties, xml) ?? value;

        const locationString = typeof location === 'object' ? JSON.stringify(location) : location;

        tbody.innerHTML += `
        <tr>
              <td>
                  ${name}
                  <p class='key-desc'>${desk}</p>
                  <p style='margin-top:2px' class='key-desc'>xml: ${xml ?? ''}</p>
              </td>
              
            <td>
            ${GenerateControlByType(name, desk, value, xml, xmlParsedValue, locationString, isConfig, control)}
            </td>
            </ >
        `;
    });
}
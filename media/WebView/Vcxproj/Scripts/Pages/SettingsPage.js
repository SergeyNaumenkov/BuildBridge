function GenerateSettingsTableContent() {
    const fields = [
        ['Theme', 'Change current theme', 'select', ['Light', 'Dark', 'System']],
        ['Behavior After Save', 'Change Behavior after save changes in file', 'select', ['Close WebView', 'Nothing', 'Reload']],
    ];

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    document.getElementById('Page_Title').innerHTML = 'Settings';

    fields.forEach(([name, desc, type, value]) => {
        const control = type === 'select'
            ? `<select style='width:100%;padding:5px'>
                ${value.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
               </select>`
            : `<input type="${type}" value="${value}">`;

        tbody.innerHTML += `
            <tr>
                <td>
                    ${name}
                    <p class='key-desc'>${desc}</p>
                </td>
                <td>${control}</td>
            </tr>
        `;
    });
}
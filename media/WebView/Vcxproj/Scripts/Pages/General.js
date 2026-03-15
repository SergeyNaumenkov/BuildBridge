const pagesContent = {
    General: {
        title: 'General',
        fields: [
            [
                'Output Directory', // name
                'Directory which output is write', // description
                '$(SolutionDir)$(Platform)\\$(Configuration)\\', // value
                'OutDir', // xml tag
                'PropertyGroup', // xml parent tag
                true // used configuration
                // Dont use control declaration for this field because its default input
            ],
            [
                'Intermediate Directory', // name
                'Directory which build files is write', // description
                '$(ShortProjectName)\\$(Platform)\\$(Configuration)\\', // value
                'IntDir', // xml tag
                'PropertyGroup', // xml parent tag
                true // used configuration
                // Dont use control declaration for this field because its default input
            ],
            [
                'Target Name', // name
                'Project name. Applied after build', // description
                '$(ProjectName)', // value
                'TargetName', // xml tag
                'PropertyGroup', // xml parent tag
                true // used configuration
                // Dont use control declaration for this field because its default input
            ],
            [
                'Configuration Type', // name
                'Configuration Type', // description
                'Application', // value
                'ConfigurationType', // xml tag
                'PropertyGroup', // xml parent tag
                true, // used configuration
                {
                    Type: 'dropdown', // Control type
                    Values: ['Application', 'DynamicLibrary', 'StaticLibrary', 'Makefile']
                }
            ],
            [
                'Windows SDK', // name
                'Windows sdk for this project', // description
                '10.0', // value
                'WindowsTargetPlatformVersion', // xml tag
                'Global', // xml parent tag
                false, // used configuration
                {
                    Type: 'dropdown', // Control type
                    Values: ['10.0']
                }
            ],
            [
                'MSVC Build Tools', // name
                'Set MSVC build tools version for this project', // description
                'v145', // value
                'PlatformToolset', // xml tag
                'PropertyGroup', // xml parent tag
                true, // used configuration
                {
                    Type: 'dropdown', // Control type
                    Values: ['v145']
                }
            ],
            [
                'C++ Standard', // name
                'Set C++ standard', // description
                'Default', // value
                'LanguageStandard', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, // xml parent tag
                true, // used configuration
                {
                    Type: 'dropdown', // Control type
                    Values: ['Default', 'stdcpp14', 'stdcpp17', 'stdcpp20', 'stdcpp23', 'stdcpplatest']
                }
            ],
            [
                'C Standard', // name
                'Set C standard', // description
                'Default', // value
                'LanguageStandard_C', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, // xml parent tag
                true, // used configuration
                {
                    Type: 'dropdown', // Control type
                    Values: ['Default', 'stdc11', 'stdc17', 'stdclatest']
                }
            ]
        ]
    },
    Advanced: {
        title: 'General / Advanced',
        fields: [
            [
                'Target File Extension', // name
                'Set custom output file extension', // description
                '.exe', // value
                'TargetExt', // xml tag
                'PropertyGroup', // xml parent tag
                true // used configuration
            ],
            [
                'Use Debug Libraries', // name
                'Use Debug Libraries for this build', // description
                true, // value
                'UseDebugLibraries', // xml tag
                'PropertyGroup', // xml parent tag
                true, // used configuration
                {
                    Type: 'checkbox', // Control type
                }
            ],
            [
                'Character Set', // name
                'Set Character Set', // description
                'Unicode', // value
                'CharacterSet', // xml tag
                'PropertyGroup', // xml parent tag
                true, // used configuration
                {
                    Type: 'dropdown', // Control type
                    Values: ['Unicode', 'MultiByte']
                }
            ],
        ]
    },
    Debugging: {
        title: 'General / Debugging',
        fields: [
            ['Command', 'The debug command to execute', '$(TargetPath)', 'LocalDebuggerCommand', 'ParentName', false],
            ['Command Arguments', 'Command line arguments. It may be empty', '', 'LocalDebuggerCommandArguments', 'ParentName', false],
            ['Working Directory', 'The Application\'s working directory', '$(ProjectDir)', 'LocalDebuggerWorkingDirectory', 'ParentName', false],
        ]
    }
};

function GenerateGeneralPages(pageName, ParsedVcxProj) {

    /* Get content */
    const content = pagesContent[pageName];

    GenerateTableContent(content, ParsedVcxProj);
}
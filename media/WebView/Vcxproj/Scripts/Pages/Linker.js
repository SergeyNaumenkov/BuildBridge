const LINKER_PagesContent = {
    General: {
        title: 'Linker / General',
        fields: [
            ['Output File', 'Set custom output file name and extension', '$(OutDir)$(TargetName)$(TargetExt)', 'OutputFile', { parent: 'ItemDefinitionGroup', child: 'Link' }, true],
            [
                'Enable Incremental Linking', // name
                'Enable Incremental Linking', // description
                'true', // value
                'LinkIncremental', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'Link' }, // xml parent tag
                true, // used configuration
                {
                    Type: 'checkbox', // Control type
                }
            ],
            [
                'Suppress Startup Banner', // name
                'Enable/Disable for aditional information when project is building', // description
                'true', // value
                'SuppressStartupBanner', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'Link' }, // xml parent tag
                true, // used configuration
                {
                    Type: 'checkbox', // Control type
                }
            ],
            ['Additional Library Directory', 'Redefine base path for .lib', '', 'AdditionalLibraryDirectories', { parent: 'ItemDefinitionGroup', child: 'Link' }, true],
        ]
    },
    Input: {
        title: 'Linker / Input',
        fields: [
            ['Additional Dependencies', 'Add other libraries to project', '$(CoreLibraryDependencies);%(AdditionalDependencies)', 'AdditionalDependencies', { parent: 'ItemDefinitionGroup', child: 'Link' }, true],
            [
                'Ignore all default libraries', // name
                'Ignore default libraries when project is build', // description
                'false', // value
                'IgnoreAllDefaultLibraries', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'Link' }, // xml parent tag
                true, // used configuration
                {
                    Type: 'checkbox', // Control type
                }
            ]
        ]
    },
    System: {
        title: 'Linker / System',
        fields: [
            [
                'SubSystem', // name
                'Set SubSystem for this project', // description
                'Console', // value
                'SubSystem', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'Link' }, // xml parent tag
                true, // used configuration
                {
                    Type: 'dropdown', // Control type
                    Values: ['Console', 'Windows', 'Native', 'EFI Application', 'EFI Boot Service Driver', 'EFI ROM', 'EFI Runtime', 'POSIX', 'NotSet']
                }
            ],
            [
                'Heap Reserve Size', // name
                'Set specfies total heap allocation size in virtual memory. default is 1MB', // description
                '', // value
                'HeapReserveSize', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'Link' }, // xml parent tag
                true // used configuration
            ],
            [
                'Heap Commit Size', // name
                'Set specfies total heap allocation size in physical memory. default is 4KB', // description
                '', // value
                'HeapCommitSize', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'Link' }, // xml parent tag
                true // used configuration
            ],
        ]
    },
    Advanced: {
        title: 'Linker / Advanced',
        fields: [
            [
                'Entry Point', // name
                'Set custom Entry Point for project', // description
                '', // value
                'EntryPointSymbol', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'Link' }, // xml parent tag
                true // used configuration
            ],
            [
                'Random Base Address', // name
                'Set Randomized base address', // description
                'true', // value
                'RandomizedBaseAddress', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'Link' }, // xml parent tag
                true, // used configuration
                {
                    Type: 'checkbox'
                }
            ],
            [
                'Import Library', // name
                'Import libraries in project', // description
                '', // value
                'ImportLibrary', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'Link' }, // xml parent tag
                true // used configuration
            ],
            [
                'Target Machine', // name
                'Set option for specifies the target platform for the program', // description
                'true', // value
                'TargetMachine', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'Link' }, // xml parent tag
                true, // used configuration
                {
                    Type: 'dropdown',
                    Values: ['NotSet', 'MachineARM', 'MachineARM64', 'MachineEBC', 'MachineIA64', 'MachineMIPS', 'MachineMIPS16', 'MachineMIPSFPU', 'MachineMIPSFPU16', 'MachineSH4', 'MachineTHUMB', 'MachineX64', 'MachineX86']
                }
            ],
        ]
    }
};

function GenerateLinkerPages(pageName, ParsedVcxProj) {

    /* Get content */
    const content = LINKER_PagesContent[pageName];

    GenerateTableContent(content, ParsedVcxProj);
}
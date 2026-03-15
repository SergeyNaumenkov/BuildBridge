const CPP_PagesContent = {
    General: {
        title: 'C++ / General',
        fields: [
            [
                'Additional Include Directories', // name
                'Include directories for project', // description
                '', // value
                'AdditionalIncludeDirectories', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, // xml parent tag
                true // used configuration
                // Dont use control declaration for this field because its default input
            ],
            [
                'Warning Level', // name
                'Set warning level for project', // description
                'TurnOffAllWarnings', // value
                'WarningLevel', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, // xml parent tag
                true, // used configuration
                {
                    Type: 'dropdown', // Control type
                    Values: ['TurnOffAllWarnings', 'Level1', 'Level2', 'Level3', 'Level4', 'EnableAllWarnings']
                }
            ],
            [
                'Treat warnings as error', // name
                'Warning = error', // description
                '', // value
                'TreatWarningAsError', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, // xml parent tag
                true, // used configuration
                {
                    Type: 'checkbox', // Control type
                }
            ],
            [
                'SDL Check', // name
                'Check Security Development Lifecycle', // description
                '', // value
                'SDLCheck', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, // xml parent tag
                true, // used configuration
                {
                    Type: 'checkbox', // Control type
                }
            ]
        ]
    },
    Optimization: {
        title: 'C++ / Optimization',
        fields: [
            [
                'Optimization', // name
                'Set option for optimization code', // description
                'Disabled', // value
                'Optimization', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, // xml parent tag
                true, // used configuration
                {
                    Type: 'dropdown', // Control type
                    Values: ['Disabled', 'MaxSpeed', 'MinSpace', 'Full']
                }
            ],
            [
                'Optimization', // name
                'Set option for optimization code', // description
                'Disabled', // value
                'Optimization', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, // xml parent tag
                true, // used configuration
                {
                    Type: 'dropdown', // Control type
                    Values: ['Disabled', 'MaxSpeed', 'MinSpace', 'Full']
                }
            ],
        ]
    },
    CodeGeneration: {
        title: 'C++ / Code Generation',
        fields: [
            ['EnableStringPooling', 'Enable string pooling optimization', '', 'StringPooling', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'checkbox' }],
            ['EnableMinimalRebuild', 'Enables minimal rebuild', '', 'MinimalRebuild', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'checkbox' }],
            ['EnableCppExceptions', 'Enable C++ exception handling', 'Sync (/EHsc)', 'ExceptionHandling', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'dropdown', Values: ['false', 'Sync', 'SyncCThrow', 'Async'] }],
            ['SmallerTypeCheck', 'Enable smaller type check', '', 'SmallerTypeCheck', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'checkbox' }],
            ['BasicRuntimeChecks', 'Basic runtime checks', 'Default', 'BasicRuntimeChecks', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'dropdown', Values: ['Default', 'StackFrameRuntimeCheck', 'UninitializedLocalUsageCheck', 'EnableFastChecks'] }],
            ['RuntimeLibrary', 'Runtime library', 'MultiThreadedDebugDLL', 'RuntimeLibrary', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'dropdown', Values: ['MultiThreaded', 'MultiThreadedDebug', 'MultiThreadedDLL', 'MultiThreadedDebugDLL'] }],
            ['StructMemberAlignment', 'Struct member alignment', 'Default', 'StructMemberAlignment', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'dropdown', Values: ['Default', '1Byte', '2Bytes', '4Bytes', '8Bytes', '16Bytes'] }],
            ['SecurityCheck', 'Enable security check', 'EnableFastChecks', 'SecurityCheck', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'dropdown', Values: ['Disable', 'EnableFastChecks'] }],
            ['ControlFlowGuard', 'Enable control flow guard', '', 'GuardCF', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'checkbox' }],
            ['FunctionLevelLinking', 'Enable function-level linking', '', 'FunctionLevelLinking', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'checkbox' }],
            ['ParallelCodeGeneration', 'Enable parallel code generation', '', 'MultiProcessorCompilation', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'checkbox' }],
            ['EnhancedInstructionSet', 'Enable enhanced instruction set', 'NotSet', 'EnableEnhancedInstructionSet', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'dropdown', Values: ['NotSet', 'AdvancedVectorExtensions', 'AdvancedVectorExtensions2', 'AdvancedVectorExtensions512', 'NoExtensions', 'StreamingSIMDExtensions', 'StreamingSIMDExtensions2'] }],
            ['FloatingPointModel', 'Floating point model', 'Precise', 'FloatingPointModel', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'dropdown', Values: ['Precise', 'Strict', 'Fast'] }],
            ['FloatingPointExceptions', 'Enable floating point exceptions', '', 'FloatingPointExceptions', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'checkbox' }],
            ['HotpatchableImage', 'Create hotpatchable image', '', 'CreateHotpatchableImage', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'checkbox' }],
            ['SpectreMitigation', 'Spectre mitigation', 'Disabled', 'SpectreMitigation', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'dropdown', Values: ['Disabled', 'Spectre'] }],
            ['EnableJCCErratum', 'Enable Intel JCC erratum mitigation', '', 'EnableJCCErratum', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'checkbox' }],
            ['EHContinuationMetadata', 'Enable EH continuation metadata', '', 'EHContMetadata', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true, { Type: 'checkbox' }],
        ]
    },
    Preprocessors: {
        title: 'C++ / Preprocessors',
        fields: [
            ['Preprocessor Definitions', 'Defines a preprocessing symbols for your source file', '_DEBUG;_CONSOLE;%(PreprocessorDefinitions)', 'PreprocessorDefinitions', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true],
        ]
    },
    PrecomHeaders: {
        title: 'C++ / Precompiled Headers',
        fields: [
            ['Precompiled Header', 'Create or Use Precompiled Header', 'Not Using Precompiled Headers', 'PrecompiledHeader', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true],
            ['Precompiled Header File', 'Set Precompiled Header', 'stdafx.h', 'PrecompiledHeaderFile', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true],
            ['Precompiled Header Output File', 'Set Precompiled Header out file', '$(IntDir)$(TargetName).pch', 'PrecompiledHeaderOutputFile'],
        ]
    },
    Advanced: {
        title: 'C++ / Advanced',
        fields: [
            [
                'Compile As', // name
                'Select compile language for C and C++', // description
                'Default', // value
                'CompileAs', // xml tag
                { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, // xml parent tag
                true, // used configuration
                {
                    Type: 'dropdown', // Control type
                    Values: ['Default', 'CompileAsC', 'CompileAsCpp', 'CompileAsCppModule', 'CompileAsCppModuleInternalPartition', 'CompileAsHeaderUnit']
                }
            ],
            ['Disable Specific Warnings', 'Disable the desired warning numbers', '', 'DisableSpecificWarnings', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true],
            ['Treat Specific Warnings As Errors', 'Treat Specific Warnings As Errors', '', 'TreatSpecificWarningsAsErrors', { parent: 'ItemDefinitionGroup', child: 'ClCompile' }, true],
        ]
    }
};

function GenerateCppPages(pageName, ParsedVcxProj) {

    /* Get content */
    const content = CPP_PagesContent[pageName];

    GenerateTableContent(content, ParsedVcxProj);
}
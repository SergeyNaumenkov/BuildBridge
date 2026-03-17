import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { UserCollectedProjectInformation } from "../../Models/IProjectInformation";
import { generateUUID, GetProjectPlatformAndConfiguration, GetResolvedConfigurations, UnMapPlatform } from '../Utils/GeneratorUtils';
import { ExtensionContext } from '../../Utils/ExtensionContext';
import { ProjectTemplateName } from '../../Types/ProjectTemplateType';

export class VcxprojGenerator {
    private _projectData: UserCollectedProjectInformation | null = null;
    private _projectPath: string = '';
    private _projectUUID: string = '';
    private _projectWorkspaceFolder: string = '';
    private _projectTemplateUsed: ProjectTemplateName = ProjectTemplateName.ConsoleApplication;

    constructor() {

    }

    /* 
        Load Template from media folder 
        and generate based on 'ProjectTemplateName' type
    */
    async LoadFromTemplate(projectTemplate: ProjectTemplateName, projectData: UserCollectedProjectInformation, workspaceFolder: string): Promise<boolean> {
        if (!projectTemplate || !projectData) {
            return false;
        }

        this._projectData = projectData;
        this._projectWorkspaceFolder = workspaceFolder;
        this._projectTemplateUsed = projectTemplate;

        // Get path to template
        const templatePath = this.PreparePathToTemplate(projectTemplate);
        if (templatePath === 'Bad') {
            return false;
        }

        // Generate UUID
        this._projectUUID = generateUUID();

        // Parse template
        const templateContent = this.ParseTemplate(templatePath);
        if (!templateContent) {
            return false;
        }

        const result = await this.WriteProject(templateContent);
        return result;
    }

    private ParseTemplate(templatePath: string) {
        if (!fs.existsSync(templatePath) || !this._projectData) {
            return undefined;
        }

        let content = fs.readFileSync(templatePath, 'utf-8');

        // Replace configurations
        content = this.GenerateProjectConfiguration(content);

        // Generate and replace code in Project Configuration ( on the top of the file )
        content = this.GeneratePropGroupConfigurationLabel(content);

        // Generate and replace code in Properties Group with Label 'Configuration' 
        content = this.GenerateConfigurationImports(content);

        // Generate and replace code in configuration imports
        content = this.GenerateItemDefinitionGroupByConfiguration(content);

        // Replace uuid
        content = content.replace('{{@ProjectUUID@}}', this._projectUUID);

        // Try Find ProjectName macross
        content = content.replaceAll('{{@ProjectName@}}', this._projectData.ProjectName);


        // Try find ProjectSourceFileName for source file
        const SourceFiles = `  <ClCompile Include='${this._projectData.ProjectName}.cpp' />`;
        content = content.replaceAll('{{SourceFilesPutHere}}', SourceFiles);

        return content;
    }

    /* 
       Generate and replace code in Project Configuration ( on the top of the file )
    */
    private GenerateProjectConfiguration(content: string): string {
        if (!this._projectData) {
            return content;
        }

        // Get resolved configurations
        const { configs, platforms } = GetResolvedConfigurations(this._projectData);

        let stringContent = '';
        configs.forEach(config => {
            platforms.forEach(platform => {
                stringContent += `  <ProjectConfiguration Include="${config}|${platform}">` + '\n';
                stringContent += `    <Configuration>${config}</Configuration>` + '\n';
                stringContent += `    <Platform>${platform}</Platform>` + '\n';
                stringContent += `  </ProjectConfiguration>` + '\n';

            });
        });

        stringContent = stringContent.trim();

        // replace
        content = content.replaceAll('{{$ProjectConfiguration$}}', stringContent);

        return content;
    }

    /* 
       Generate and replace code in Properties Group with Label 'Configuration' 
    */
    private GeneratePropGroupConfigurationLabel(content: string): string {
        if (!this._projectData) {
            return content;
        }


        // Get resolved configurations
        const { configs, platforms } = GetResolvedConfigurations(this._projectData);

        const configTypeMap = {
            [ProjectTemplateName.ConsoleApplication]: 'Application',
            [ProjectTemplateName.SharedLibrary]: 'StaticLibrary',
            [ProjectTemplateName.DynamicLibrary]: 'DynamicLibrary'
        };
        const configType = configTypeMap[this._projectTemplateUsed] || 'Application';

        let stringContent = '';
        configs.forEach(config => {
            platforms.forEach(platform => {
                stringContent += `  <PropertyGroup Condition="'$(Configuration)|$(Platform)'=='${config}|${platform}'" Label="Configuration">` + '\n';
                stringContent += `    <ConfigurationType>${configType}</ConfigurationType>` + '\n';
                stringContent += `    <UseDebugLibraries>${config === 'Debug' ? 'true' : 'false'}</UseDebugLibraries>` + '\n';
                stringContent += `    <PlatformToolset>v145</PlatformToolset>` + '\n';
                if (config === 'Release') {
                    stringContent += `    <WholeProgramOptimization>true</WholeProgramOptimization>` + '\n';
                }
                if (configType === ProjectTemplateName.DynamicLibrary) {
                    stringContent += `    <LinkIncremental>true</LinkIncremental>` + '\n';
                }
                stringContent += `    <CharacterSet>Unicode</CharacterSet>` + '\n';
                stringContent += `  </PropertyGroup>` + '\n';

            });
        });

        stringContent = stringContent.trim();

        // replace
        content = content.replaceAll('{{$PropertiesGroupLabelConfiguration$}}', stringContent);

        return content;
    }

    /* 
       Generate and replace code in configuration imports
   */
    private GenerateConfigurationImports(content: string): string {
        if (!this._projectData) {
            return content;
        }

        // Get resolved configurations
        const { configs, platforms } = GetResolvedConfigurations(this._projectData);

        let stringContent = '';
        configs.forEach(config => {
            platforms.forEach(platform => {
                stringContent += `  <ImportGroup Label="PropertySheets" Condition="'$(Configuration)|$(Platform)'=='${config}|${platform}'">` + '\n';
                stringContent += `    <Import Project="$(UserRootDir)\Microsoft.Cpp.$(Platform).user.props" Condition="exists('$(UserRootDir)\Microsoft.Cpp.$(Platform).user.props')" Label="LocalAppDataPlatform" />` + '\n';
                stringContent += `  </ImportGroup>` + '\n';
            });
        });

        stringContent = stringContent.trim();

        // replace
        content = content.replaceAll('{{$ProjectImportsByConfiguration$}}', stringContent);

        return content;
    }

    /* 
        Generate and replace code in ItemDefinitions
    */
    private GenerateItemDefinitionGroupByConfiguration(content: string): string {
        if (!this._projectData) {
            return content;
        }

        // Get resolved configurations
        const { configs, platforms } = GetResolvedConfigurations(this._projectData);
        const defines = { Debug: '_DEBUG;_CONSOLE;%(PreprocessorDefinitions)', Release: 'NDEBUG;_CONSOLE;%(PreprocessorDefinitions)' };

        const configTypeMap = {
            [ProjectTemplateName.ConsoleApplication]: 'Link',
            [ProjectTemplateName.SharedLibrary]: 'Lib',
            [ProjectTemplateName.DynamicLibrary]: 'Link'
        };
        const tagType = configTypeMap[this._projectTemplateUsed] || 'Link';

        let stringContent = '';
        configs.forEach(config => {
            platforms.forEach(platform => {
                stringContent += `  <ItemDefinitionGroup Condition="'$(Configuration)|$(Platform)'=='${config}|${platform}'">` + '\n';
                stringContent += `    <ClCompile>` + '\n';
                stringContent += `      <WarningLevel>Level3</WarningLevel>` + '\n';
                stringContent += `      <SDLCheck>true</SDLCheck>` + '\n';
                stringContent += `      <PreprocessorDefinitions>${config === 'Debug' ? defines.Debug : defines.Release}</PreprocessorDefinitions>` + '\n';
                stringContent += `      <ConformanceMode>true</ConformanceMode>` + '\n';
                stringContent += `      <LanguageStandard>stdcpp20</LanguageStandard>` + '\n';
                stringContent += `    </ClCompile>` + '\n';
                stringContent += `    <${tagType}>` + '\n';
                stringContent += `      <AdditionalDependencies>kernel32.lib;%(AdditionalDependencies)</AdditionalDependencies>` + '\n';
                if (this._projectTemplateUsed === ProjectTemplateName.SharedLibrary) {
                    stringContent += `      <OutputFile>$(OutDir)$(TargetName)$(TargetExt)</OutputFile>` + '\n';
                }
                else if (this._projectTemplateUsed === ProjectTemplateName.DynamicLibrary) {
                    stringContent += `      <SubSystem>Windows</SubSystem>` + '\n';
                }
                else {
                    stringContent += `      <SubSystem>Console</SubSystem>` + '\n';
                }
                stringContent += `      <GenerateDebugInformation>true</GenerateDebugInformation>` + '\n';
                stringContent += `    </${tagType}>` + '\n';
                stringContent += `  </ItemDefinitionGroup>` + '\n';
            });
        });

        stringContent = stringContent.trim();

        // replace
        content = content.replaceAll('{{$ProjectItemDefinitionsConfiguration$}}', stringContent);

        return content;
    }


    /* 
    
        Finnaly, after replaces write project file
    */
    private async WriteProject(content: string): Promise<boolean> {
        if (!this._projectWorkspaceFolder || !this._projectData) {
            return false;
        }

        const outFileName = path.join(this._projectWorkspaceFolder, this._projectData.ProjectName, `${this._projectData.ProjectName}.vcxproj`);
        this._projectPath = outFileName;

        // Write
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(outFileName),
            Buffer.from(content, 'utf-8')
        );

        // generate source file 
        const result = await this.GenerateSourceFile();
        return result;
    }

    /* 
        Generate source file for this project
    */
    private async GenerateSourceFile(): Promise<boolean> {
        if (!this._projectWorkspaceFolder || !this._projectData) {
            return false;
        }

        const outFileName = path.join(this._projectWorkspaceFolder, this._projectData.ProjectName, `${this._projectData.ProjectName}.cpp`);
        const fileContent = '#include <cstdio>\nint main()\n{\n\tprintf("Hello from BuildForge build system");\n\treturn 0;\n}';

        // Write
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(outFileName),
            Buffer.from(fileContent, 'utf-8')
        );

        return true;
    }

    /* 
        Get generated UUID for this project
    */
    public GetProjectUUID(): string {
        return this._projectUUID;
    }

    /* 
        Get path to generated .vcxproj
    */
    public GetProjectPath(): string {
        return this._projectPath;
    }

    /* 
        Utils method for get project configuration
    */
    public GetProjectConfigurations(): { configs: string[], platforms: string[] } {
        if (!this._projectData) {
            return { configs: [], platforms: [] };
        }

        return GetProjectPlatformAndConfiguration(this._projectData);
    }

    // Utils
    private PreparePathToTemplate(projectTemplate: ProjectTemplateName): string {
        const mediaFolderPath = ExtensionContext.GetPathToMediaFolder().fsPath;
        const templateFolder = path.join(mediaFolderPath, 'cpp', 'templates');

        return path.join(templateFolder, 'ConsoleApplication.vcxproj');
    }

}


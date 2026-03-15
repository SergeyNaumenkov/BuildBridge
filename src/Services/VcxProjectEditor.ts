/* 

    This is a temporary solution that I came to,
    because all popular parsers format the file so that it becomes unreadable.
    In the future, a more improved way of editing a file will be implemented.

*/

import { DOMParser, XMLSerializer } from 'xmldom';

import * as vscode from 'vscode';
import * as fs from 'fs';
import path from 'path/win32';

export class SourceFilesSection {
    private content: string;

    constructor(content: string) {
        this.content = content;
    }

    addFile(file: string): string {
        const tag = this.getTag(file);

        if (this.content.includes(`Include="${file}"`)) {
            return this.content;
        }

        const indent = this.getIndent();
        const newEntry = `${indent}<${tag} Include="${file}"/>\n`;
        const searchStr = `<${tag} Include=`;
        const tagIndex = this.content.lastIndexOf(searchStr);

        if (tagIndex !== -1) {
            const itemGroupClose = this.content.indexOf('</ItemGroup>', tagIndex);
            this.content = this.content.slice(0, itemGroupClose) + newEntry + this.content.slice(itemGroupClose);
        } else {
            const itemGroupRegex = /<ItemGroup(?![^>]*Label)[^>]*>[\s\S]*?<\/ItemGroup>/g;
            const matches = [...this.content.matchAll(itemGroupRegex)];

            if (matches.length > 0) {
                const lastMatch = matches[matches.length - 1];
                const insertPos = lastMatch.index! + lastMatch[0].lastIndexOf('</ItemGroup>');
                this.content = this.content.slice(0, insertPos) + newEntry + this.content.slice(insertPos);
            } else {
                const projectClose = this.content.lastIndexOf('</Project>');
                this.content = this.content.slice(0, projectClose) + `<ItemGroup>\n${newEntry}</ItemGroup>\n` + this.content.slice(projectClose);
            }
        }

        return this.content;
    }

    removeFile(file: string): string {
        const tag = this.getTag(file);
        const fileName = path.basename(file);

        const regex = new RegExp(`\\s*<${tag} Include="${fileName}"\\s*\\/?>\\s*\\n?`);
        this.content = this.content.replace(regex, '\n');

        return this.content;
    }

    getFiles(): string[] {
        const files: string[] = [];
        const regex = /<(?:ClCompile|ClInclude) Include="([^"]+)"/g;
        let match;
        while ((match = regex.exec(this.content)) !== null) {
            files.push(match[1]);
        }
        return files;
    }

    setValue(tag: string, value: string): string {
        const regex = new RegExp(`(<${tag}>)[^<]*(<\/${tag}>)`);

        if (regex.test(this.content)) {
            this.content = this.content.replace(regex, `$1${value}$2`);
        } else {
        }

        return this.content;
    }

    private getTag(file: string): string {
        const ext = path.extname(file).toLowerCase();
        return ext === '.h' || ext === '.hpp' ? 'ClInclude' : 'ClCompile';
    }

    private getIndent(): string {
        const match = this.content.match(/\n(\s+)<(?:ClCompile|ClInclude)/);
        return match ? match[1] : '    ';
    }
}

interface PendingChange {
    Key: string;
    Value: string;
    Location: string | { parent: string, child: string };
    isConfig: string;
    Configuration: string | null;
}

const TagForSlashes = [
    'OutDir',
    'IntDir'
];

function FixSlashesInValue(tag: string, value: string) {

    const isFound = TagForSlashes.includes(tag);
    if (isFound) {
        const isBackSlash = value.includes('\\');
        if (isBackSlash && !value.endsWith('\\')) {
            value += '\\';
        }
        else if (!value.endsWith('/')) {
            value += '/';
        }
    }

    return value;
}

export class VcxProjectEditor {
    constructor() {

    }

    async AddFile(uri: string, addedFile: string) {
        if (!uri) {
            return;
        }

        let content = await fs.promises.readFile(uri, 'utf-8');

        // Parse section with source files and add new file
        const section = new SourceFilesSection(content);
        const result = section.addFile(addedFile);
        await fs.promises.writeFile(uri, result, 'utf-8');
    }

    async RemoveFile(uri: string, removedFile: string) {
        if (!uri) {
            return;
        }

        const content = await fs.promises.readFile(uri, 'utf-8');

        // Parse section with source files and remove file 
        const section = new SourceFilesSection(content);
        const result = section.removeFile(removedFile);
        await fs.promises.writeFile(uri, result, 'utf-8');
    }

    async AddOrChangeProp(uri: string, content: PendingChange[]) {
        const fileContent = await fs.promises.readFile(uri, 'utf-8');
        const dom = new DOMParser().parseFromString(fileContent, 'text/xml');

        content.forEach(change => {
            let location: string | { parent: string, child: string };
            try {
                location = JSON.parse((change.Location as string));
            } catch {
                location = change.Location;
            }

            const tagName = typeof location === 'string'
                ? location
                : location.parent;

            const groups = dom.getElementsByTagName(tagName);
            let targetGroup: Element | null = null;

            change.Value = FixSlashesInValue(change.Key, change.Value);

            for (let i = 0; i < groups.length; i++) {
                const condition = groups[i].getAttribute('Condition');

                // try find in configuration field
                if (change.isConfig === 'true') {
                    if (condition && condition.includes(change.Configuration!)) {
                        targetGroup = groups[i];
                        break;
                    }
                }
                else { // It's field is global, just get value
                    if (!condition) {
                        targetGroup = groups[i];
                        break;
                    }
                }

            }

            /* 
                if location is array, then go to location->child and change prop there
                it code need if prop is not found and his need to create
            */
            if (targetGroup && typeof location === 'object') {
                const childGroup = (targetGroup as Element).getElementsByTagName(location.child)[0];
                if (childGroup) {
                    const prop = childGroup.getElementsByTagName(change.Key)[0];
                    if (prop) {
                        prop.textContent = change.Value;
                    } else {
                        const newProp = dom.createElement(change.Key);
                        newProp.textContent = change.Value;
                        childGroup.appendChild(dom.createTextNode('  '));
                        childGroup.appendChild(newProp);
                        childGroup.appendChild(dom.createTextNode('\n'));
                    }
                }
            }
            else {
                const prop = (targetGroup as Element).getElementsByTagName(change.Key)[0];
                if (prop) {
                    prop.textContent = change.Value;
                }
                else {
                    if (targetGroup) {
                        var newProp = dom.createElement(change.Key);
                        newProp.textContent = change.Value;
                        targetGroup.appendChild(dom.createTextNode('   '));
                        (targetGroup as Element).appendChild(newProp);
                        targetGroup.appendChild(dom.createTextNode('\n'));
                    }
                }
            }


        });
        const serializer = new XMLSerializer();
        const res = serializer.serializeToString(dom);

        await fs.promises.writeFile(uri, res);
    }
}
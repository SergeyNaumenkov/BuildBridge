import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { ProjectSession } from '../Models/LocalProjectSession';
import { CheckMSBuild } from '../Utils/MSBuildLocator';
import { exec } from 'child_process';

var LastConfiguration: string = '';
var LastPlatform: string = '';
var CustomTargetName = '';
var LastCustomTargetName = 'CustomName';

function TryGetTargetName(msbuildPath: string, session: ProjectSession) {
    return new Promise<string>((resolve, reject) => {
        exec(
            `"${msbuildPath}" "${session.vcxprojPath}" /getProperty:TargetName /p:Configuration=${session.activeConfig} /p:Platform=${session.activePlatform}`,
            (error, stdout) => {
                if (error) { reject(error); return; }

                const rawOut = stdout.trim();
                CustomTargetName = rawOut;
                resolve(CustomTargetName);
            }
        );
    });
}

export function RegisterProjectGetStartupFileCommand(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand('buildbridge.getExePath', async () => {
        const session = ProjectSession.getInstance();

        // Check cache
        if (session.exePaths && (session.activeConfig === LastConfiguration && session.activePlatform === LastPlatform)) {
            return session.exePaths;
        }
        // if cache is empty - call msbuild
        const msbuildPath = await CheckMSBuild(context);
        if (!msbuildPath || !session.vcxprojPath) { return; }

        LastConfiguration = session.activeConfig;
        LastPlatform = session.activePlatform;

        // const target = await TryGetTargetName(msbuildPath, session);

        return new Promise<string>((resolve, reject) => {
            exec(
                `"${msbuildPath}" "${session.vcxprojPath}" /getProperty:OutDir;TargetName /p:Configuration=${session.activeConfig} /p:Platform=${session.activePlatform}`,
                (error, stdout) => {
                    if (error) { reject(error); return; }

                    const lines = stdout.trim().split('\n').map(l => l.trim()).filter(Boolean);

                    const targetNameLine = lines.find(l => l.startsWith('"TargetName"'));
                    const targetName = targetNameLine?.split(':')[1]?.trim().replace(/"/g, '');

                    const outDirLine = lines.find(l => l.startsWith('"OutDir"'));
                    const colonIndex = outDirLine?.indexOf(':') ?? -1;
                    const ooutDir = outDirLine?.substring(colonIndex + 1).trim().replace(/"/g, '').replace(/,\s*$/, '').replace(/\\$/, '');
                    const rawOut = ooutDir!;

                    const vcxDir = path.dirname(session.vcxprojPath!);
                    const slnxDir = path.dirname(session.solutionFilePath);

                    const normalizedOutDir = rawOut.replace(/\\\\/g, '\\');
                    const resolvedOutDir = normalizedOutDir.replace(vcxDir + path.sep, slnxDir + path.sep);

                    const exeName = targetName || path.basename(session.vcxprojPath!, '.vcxproj');
                    const fullPath = path.join(resolvedOutDir, `${exeName}.exe`);
                    session.exePaths = fullPath;

                    resolve(fullPath);
                }
            );
        });
    });
}
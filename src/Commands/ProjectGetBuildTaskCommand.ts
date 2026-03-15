import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { ProjectSession } from "../Models/LocalProjectSession";

var lastConfiguration: string = '';
var lastPlatform: string = '';

export function RegisterGetProjectBuildTask(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('buildbridge.getBuildTask', async () => {
            const session = ProjectSession.getInstance();

            return `MSBuild ${session.activePlatform} ${session.activeConfig}`;
        })
    );
}
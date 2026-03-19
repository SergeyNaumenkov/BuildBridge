import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/* Utils */
import { Logger } from './Utils/Logger';
import { VcxprojParser } from './Core/Parsers/VcxprojParser';

/* 
	Entry point
*/
export function activate(context: vscode.ExtensionContext) {
	Logger.LogToOutput('=========== Extension is activate! =========== ');

	/* test */
	const parser = new VcxprojParser();
	const isCanParser = parser.CanParser('');
}

export function deactivate() { }
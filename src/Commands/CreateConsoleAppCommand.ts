import * as vscode from 'vscode';
import { SolutionTreeProvider } from '../Providers/SolutionTreeProvider';
import { CreateConsoleApplication } from '../Generator/cpp/ConsoleApplication';

export function RegisterCreateConsoleAppCommand(context: vscode.ExtensionContext, provider: SolutionTreeProvider){
    context.subscriptions.push(
		vscode.commands.registerCommand('buildbridge.cpp.CreateConsoleApplication', async () => {
			await CreateConsoleApplication(context);
			provider.refresh();
		})
	);
}
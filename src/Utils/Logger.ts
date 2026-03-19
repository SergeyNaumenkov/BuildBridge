import * as vscode from 'vscode';
import { LogLevel } from '../Types/LogLevel';

export class Logger {
    /* 
        Variables
    */
    private static readonly PREFIX = 'BuildBridge';
    private static outputChannel: vscode.LogOutputChannel | null = null;

    constructor() {

    }

    /* 
        Get output window channel for this log
    */
    private static GetOutputChannel() {
        if (!this.outputChannel) {
            this.outputChannel = vscode.window.createOutputChannel(this.PREFIX, { log: true });

            // clear old log
            this.outputChannel.clear();
        }

        return this.outputChannel;
    }

    /* 
        Show message 
    */
    static ShowMessage(message: string) {
        if (!message) {
            return;
        }

        vscode.window.showInformationMessage(message);
    }

    /* 
        Show error
    */
    static ShowError(errorMessage: string) {
        if (!errorMessage) {
            return;
        }

        vscode.window.showErrorMessage(errorMessage);
    }

    /* 
        Show warning
    */
    static ShowWarning(warningMessage: string) {
        if (!warningMessage) {
            return;
        }

        vscode.window.showWarningMessage(warningMessage);
    }

    static LogToConsole(log: string, usePrefix: boolean = true) {
        console.log(usePrefix ? this.PREFIX + ` ${log}` : log);
    }

    /* 
        Write message to output channel
    */
    static LogToOutput(log: string, logLevel: LogLevel = LogLevel.Log_Info, usePrefix: boolean = true) {
        if (!log) {
            return;
        }

        // output channel
        const outputChannel = this.GetOutputChannel();

        switch (logLevel) {
            case LogLevel.Log_Info:
                outputChannel.info(log);
                break;
            case LogLevel.Log_Warning:
                outputChannel.warn(log);
                break;
            case LogLevel.Log_Error:
                outputChannel.error(log);
                break;

            default:
                outputChannel.info(log);
                break;
        }
    }

    /* 
        Show output window with extension messages
    */
    static ShowOutputChannel() {
        const outputChannel = this.GetOutputChannel();
        outputChannel.show();
    }

    /* 
        Clear output log history
    */
   static ClearOutputLogHistory()
   {
    const outputChannel = this.GetOutputChannel();
    outputChannel.clear();
   }
}
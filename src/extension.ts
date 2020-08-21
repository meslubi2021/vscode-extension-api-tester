'use strict';

import * as vscode from 'vscode';
import * as servermanager from './commands/servermanager';
import * as vscode_objectscript from './commands/vscode-objectscript';

export const extensionId = 'intersystems-community.vscode-extension-api-tester';

export function activate(context: vscode.ExtensionContext) {

	// Register the commands

	context.subscriptions.push(
		vscode.commands.registerCommand(`${extensionId}.servermanager.pickServer`, () => {
            servermanager.pickServer();
        })
    );
	context.subscriptions.push(
		vscode.commands.registerCommand(`${extensionId}.servermanager.pickServerFlushingCachedCredentials`, () => {
            servermanager.pickServerFlushingCachedCredentials();
        })
    );
	context.subscriptions.push(
		vscode.commands.registerCommand(`${extensionId}.servermanager.pickServerDetailed`, () => {
            servermanager.pickServerDetailed();
        })
    );
	context.subscriptions.push(
		vscode.commands.registerCommand(`${extensionId}.vscode-objectscript.serverOfCurrentDocument`, () => {
            vscode_objectscript.serverOfCurrentDocument();
        })
    );
}

export function deactivate() {
}
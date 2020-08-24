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
		vscode.commands.registerCommand(`${extensionId}.servermanager.onDidChangePassword`, () => {
            servermanager.onDidChangePassword();
        })
    );
	context.subscriptions.push(
		vscode.commands.registerCommand(`${extensionId}.servermanager.offDidChangePassword`, () => {
            servermanager.offDidChangePassword();
        })
    );
	context.subscriptions.push(
		vscode.commands.registerCommand(`${extensionId}.vscode-objectscript.serverOfCurrentDocument`, () => {
            vscode_objectscript.serverOfCurrentDocument();
        })
    );
	context.subscriptions.push(
		vscode.commands.registerCommand(`${extensionId}.vscode-objectscript.serverDocumentUriOfCurrentDocument`, () => {
            vscode_objectscript.serverDocumentUriOfCurrentDocument();
        })
    );
}

export function deactivate() {
}

export interface ApiInfo {
    api?: any,
    version?: string
}

export async function getApiInfo(targetExtensionId: string): Promise<ApiInfo> {
    const targetExtension = vscode.extensions.getExtension(targetExtensionId);
    if (!targetExtension) {
        vscode.window.showErrorMessage(`Extension '${targetExtensionId}' is not installed, or has been disabled.`)
        return {};
    }
    if (!targetExtension.isActive) {
        await targetExtension.activate();
    }
    const api = targetExtension.exports;

    if (!api) {
        vscode.window.showErrorMessage(`API missing from extension ${targetExtensionId}@${targetExtension.packageJSON.version}`);
        return {};
    }
    return { api, version: targetExtension.packageJSON.version };
}

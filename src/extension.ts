"use strict";

import * as vscode from "vscode";
import * as servermanager from "./commands/servermanager";
import * as vscode_objectscript from "./commands/vscode-objectscript";

export const extensionId = "intersystems-community.vscode-extension-api-tester";
export const AUTHENTICATION_PROVIDER = "intersystems-server-credentials";

export function activate(context: vscode.ExtensionContext): void {
  // Register the commands

  context.subscriptions.push(
    vscode.commands.registerCommand(`${extensionId}.testLogin`, async () => {
      // Get our session.
      try {
        const session = await vscode.authentication.getSession(AUTHENTICATION_PROVIDER, [], {
          createIfNone: true,
        });
        console.log(session);
      } catch (error) {
        throw new Error(`vscode.authentication.getSession for ${AUTHENTICATION_PROVIDER} failed}`);
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(`${extensionId}.testScopedLogin`, async () => {
      // Get our session.
      const session = await vscode.authentication.getSession(AUTHENTICATION_PROVIDER, ["iris201", "johnm"], {
        createIfNone: true,
      });
      console.log(session);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(`${extensionId}.testQuietLogin`, async () => {
      // Get our session.
      const session = await vscode.authentication.getSession(AUTHENTICATION_PROVIDER, [], {
        createIfNone: false,
      });
      console.log(session);
    })
  );
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

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate(): void {}

export interface ApiInfo {
  api?: any;
  version?: string;
}

export async function getApiInfo(targetExtensionId: string): Promise<ApiInfo> {
  const targetExtension = vscode.extensions.getExtension(targetExtensionId);
  if (!targetExtension) {
    vscode.window.showErrorMessage(`Extension '${targetExtensionId}' is not installed, or has been disabled.`);
    return {};
  }
  if (!targetExtension.isActive) {
    await targetExtension.activate();
  }
  const api = targetExtension.exports;

  if (!api) {
    vscode.window.showErrorMessage(
      `API missing from extension ${targetExtensionId}@${targetExtension.packageJSON.version}`
    );
    return {};
  }
  return { api, version: targetExtension.packageJSON.version };
}

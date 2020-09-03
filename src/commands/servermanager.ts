import * as vscode from "vscode";
import { getApiInfo } from "../extension";

const targetExtensionId = "intersystems-community.servermanager";

interface WebServerSpec {
  scheme: string;
  host: string;
  port: number;
  pathPrefix: string;
}

interface ServerSpec {
  name: string;
  webServer: WebServerSpec;
  username: string;
  password: string;
  description: string;
}

export async function pickServer(): Promise<void> {
  await commonTestPickServer();
}

export async function pickServerFlushingCachedCredentials(): Promise<void> {
  await commonTestPickServer(undefined, true);
}

export async function pickServerDetailed(): Promise<void> {
  await commonTestPickServer({ matchOnDetail: true });
}

async function commonTestPickServer(options?: vscode.QuickPickOptions, flushCredentialCache = false) {
  const { api, version } = await getApiInfo(targetExtensionId);

  if (!api) {
    return;
  }

  if (typeof api.pickServer !== "function") {
    vscode.window.showErrorMessage(`pickServer API missing from extension ${targetExtensionId}@${version}`);
    return;
  }

  if (typeof api.getServerSpec !== "function") {
    vscode.window.showErrorMessage(`getServerSpec API missing from extension ${targetExtensionId}@${version}`);
    return;
  }

  const name: string = await api.pickServer(undefined, options);
  if (name) {
    const connSpec: ServerSpec = await api.getServerSpec(name, undefined, flushCredentialCache);
    if (connSpec) {
      vscode.window.showInformationMessage(
        `Picked server '${connSpec.name}' at ${connSpec.webServer.scheme}://${connSpec.webServer.host}:${
          connSpec.webServer.port
        }/${connSpec.webServer.pathPrefix} ${
          !connSpec.username ? "with unauthenticated access" : "as user " + connSpec.username
        }.`,
        "OK"
      );
    }
  }
}

let disposable: vscode.Disposable | undefined = undefined;

export async function onDidChangePassword(): Promise<void> {
  const { api, version } = await getApiInfo(targetExtensionId);

  if (!api) {
    return;
  }

  if (typeof api.onDidChangePassword !== "function") {
    vscode.window.showErrorMessage(`onDidChangePassword API missing from extension ${targetExtensionId}@${version}`);
    return;
  }

  if (typeof disposable !== "undefined") {
    disposable.dispose();
    disposable = undefined;
  }

  disposable = api.onDidChangePassword()((serverName) => {
    vscode.window.showInformationMessage(`onDidChangePassword event: ${serverName}`);
  });
}

export async function offDidChangePassword(): Promise<void> {
  if (typeof disposable !== "undefined") {
    disposable.dispose();
    disposable = undefined;
  }
}

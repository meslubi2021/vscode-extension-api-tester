import * as vscode from "vscode";
import { getApiInfo } from "../extension";

const targetExtensionId = "intersystems-community.vscode-objectscript";

export async function serverOfCurrentDocument(): Promise<void> {
  const { api, version } = await getApiInfo(targetExtensionId);

  if (!api) {
    return;
  }

  if (typeof api.serverForUri !== "function") {
    vscode.window.showErrorMessage(`serverForUri API missing from extension ${targetExtensionId}@${version}`);
    return;
  }
  const uri = vscode.window.activeTextEditor?.document.uri;
  if (!uri) {
    vscode.window.showErrorMessage("No active text editor");
    return;
  }
  const spec = api.serverForUri(uri);
  if (!spec) {
    vscode.window.showErrorMessage("No spec retrieved");
    return;
  }
  const password: string = spec.password;
  if (password) {
    spec.password = password.replace(/./g, "#");
  }
  vscode.window.showInformationMessage(`Server connection spec for current document is ${JSON.stringify(spec)}`);
}

export async function serverDocumentUriOfCurrentDocument(): Promise<void> {
  const { api, version } = await getApiInfo(targetExtensionId);

  if (!api) {
    return;
  }

  if (typeof api.serverDocumentUriForUri !== "function") {
    vscode.window.showErrorMessage(
      `serverDocumentUriForUri API missing from extension ${targetExtensionId}@${version}`
    );
    return;
  }
  const uri = vscode.window.activeTextEditor?.document.uri;
  if (!uri) {
    vscode.window.showErrorMessage("No active text editor");
    return;
  }
  const serverUri: vscode.Uri = api.serverDocumentUriForUri(uri);
  if (!serverUri) {
    vscode.window.showErrorMessage("No serverDocumentUri retrieved");
    return;
  }
  vscode.window.showInformationMessage(`Server document uri for current document is ${serverUri.toString()}`);
}

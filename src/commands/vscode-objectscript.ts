import * as vscode from 'vscode';

const targetExtensionId = 'daimor.vscode-objectscript';

export async function serverOfCurrentDocument() {
    const targetExtension = vscode.extensions.getExtension(targetExtensionId);
    if (!targetExtension) {
        vscode.window.showErrorMessage(`Extension '${targetExtensionId}' is not installed, or has been disabled.`)
        return
    }
    if (!targetExtension.isActive) {
        await targetExtension.activate();
    }
    const api = targetExtension.exports;

    if (!api || typeof api.serverForUri !== 'function') {
        vscode.window.showErrorMessage(`serverForUri API missing from extension ${targetExtensionId}@${targetExtension.packageJSON.version}`);
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
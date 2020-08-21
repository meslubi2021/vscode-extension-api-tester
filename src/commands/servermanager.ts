import * as vscode from 'vscode';

const targetExtensionId = 'intersystems-community.servermanager';

interface WebServerSpec {
    scheme: string,
    host: string,
    port: number,
    pathPrefix: string
}

interface ServerSpec {
    name: string,
    webServer: WebServerSpec,
    username: string,
    password: string,
    description: string
}

export async function pickServer() {
    await commonTestPickServer();
}

export async function pickServerFlushingCachedCredentials() {
    await commonTestPickServer(undefined, true);
}

export async function pickServerDetailed() {
    await commonTestPickServer({matchOnDetail: true});
}

async function commonTestPickServer(options?: vscode.QuickPickOptions, flushCredentialCache: boolean = false) {
    const targetExtension = vscode.extensions.getExtension(targetExtensionId);
    if (!targetExtension) {
        vscode.window.showErrorMessage(`Extension '${targetExtensionId}' is not installed, or has been disabled.`)
        return
    }
    if (!targetExtension.isActive) {
        await targetExtension.activate();
    }
    const api = targetExtension.exports;

    const name: string = await api.pickServer(undefined, options);
    if (name) {
        const connSpec: ServerSpec = await api.getServerSpec(name, undefined, flushCredentialCache);
        if (connSpec) {
            vscode.window.showInformationMessage(`Picked server '${connSpec.name}' at ${connSpec.webServer.scheme}://${connSpec.webServer.host}:${connSpec.webServer.port}/${connSpec.webServer.pathPrefix} ${!connSpec.username ? 'with unauthenticated access' : 'as user ' + connSpec.username }.`, 'OK');
        }
    }
}
import * as vscode from 'vscode';
import * as http from 'http';

const SENSOR_PORT = 12345;
const REACT_UI_ORIGIN = 'http://localhost:5173';

export function activate(context: vscode.ExtensionContext) {

    console.log('MCP Sensor is now active!');

    const server = http.createServer((req, res) => {

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', REACT_UI_ORIGIN);
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        res.setHeader('Access-Control-Allow-Headers', '*');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        if (req.url === '/get-project-path' && req.method === 'GET') {

            // Call VS Code API
            const workspaceFolders = vscode.workspace.workspaceFolders;
            let projectPath: string | null = null;

            if (workspaceFolders && workspaceFolders.length > 0) {
                projectPath = workspaceFolders[0].uri.fsPath;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ project_path: projectPath }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Not Found" }));
        }
    });

    server.listen(SENSOR_PORT, '127.0.0.1', () => {
        console.log(`MCP Sensor server running at http://127.0.0.1:${SENSOR_PORT}/`);
    });
}

export function deactivate() {}
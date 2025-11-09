import * as vscode from 'vscode';
import * as http from 'http'; // Node.js's built-in HTTP server

const SENSOR_PORT = 12345; // The port our React app will talk to
const REACT_UI_ORIGIN = 'http://localhost:5173'; // Your React app's address

// This function runs when your extension is activated
export function activate(context: vscode.ExtensionContext) {

    console.log('MCP Sensor is now active!');

    // Create a simple HTTP server to act as our sensor
    const server = http.createServer((req, res) => {

        // --- Set CORS Headers ---
        // This is CRITICAL to allow your React app to make a request
        res.setHeader('Access-Control-Allow-Origin', REACT_UI_ORIGIN);
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        res.setHeader('Access-Control-Allow-Headers', '*');

        // Handle the "preflight" request from the browser
        if (req.method === 'OPTIONS') {
            res.writeHead(204); // "No Content" success
            res.end();
            return;
        }

        // This is the only endpoint our React app will call
        if (req.url === '/get-project-path' && req.method === 'GET') {

            // Use the VS Code API to get the current project folder(s)
            const workspaceFolders = vscode.workspace.workspaceFolders;
            let projectPath: string | null = null;

            if (workspaceFolders && workspaceFolders.length > 0) {
                // Just grab the first open folder
                projectPath = workspaceFolders[0].uri.fsPath;
            }

            // Send the path back as JSON
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ project_path: projectPath }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Not Found" }));
        }
    });

    // Start listening on our sensor port
    server.listen(SENSOR_PORT, '127.0.0.1', () => {
        console.log(`MCP Sensor server running at http://127.0.0.1:${SENSOR_PORT}/`);
    });
}

export function deactivate() {}
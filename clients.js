#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try different possible paths for the server
const findServerPath = () => {
    const possiblePaths = [
        // Local path (same directory as clients.js)
        resolve(__dirname, 'build', 'index.js'),
        // One directory up (if clients.js is in a subdirectory)
        resolve(__dirname, '..', 'build', 'index.js'),
        // Global npm installation
        resolve(execSync('npm root -g').toString().trim(), 'mcp-server', 'build', 'index.js'),
        // Relative to current working directory
        resolve(process.cwd(), 'build', 'index.js')
    ];

    for (const path of possiblePaths) {
        if (existsSync(path)) {
            console.log('Found server at:', path);
            return path;
        }
    }

    console.error('Error: Could not find server. Tried:');
    possiblePaths.forEach(path => console.error('- ' + path));
    process.exit(1);
};

// Find and validate server path
const serverPath = findServerPath();

// Spawn the MCP server process
const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
        ...process.env,
        NODE_NO_WARNINGS: '1'
    }
});

// Forward stdin/stdout
process.stdin.pipe(server.stdin);
server.stdout.pipe(process.stdout);
server.stderr.pipe(process.stderr);

// Handle server errors
server.on('error', (error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
    server.kill('SIGTERM');
});

process.on('SIGINT', () => {
    server.kill('SIGINT');
});

server.on('exit', (code, signal) => {
    if (code !== 0) {
        console.error(`Server process exited with code ${code}`);
    }
    if (signal) {
        console.error(`Server was killed with signal ${signal}`);
    }
    process.exit(code || 0);
}); 
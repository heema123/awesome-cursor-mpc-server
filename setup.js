#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

const log = {
    success: (msg) => console.log(colors.green + '✓ ' + msg + colors.reset),
    error: (msg) => console.log(colors.red + '✗ ' + msg + colors.reset),
    info: (msg) => console.log('➜ ' + msg)
};

// Run a command and handle errors
const run = (cmd) => {
    try {
        execSync(cmd, { stdio: 'inherit' });
        return true;
    } catch (error) {
        log.error(`Command failed: ${cmd}`);
        log.error(error.message);
        return false;
    }
};

// Main setup function
async function setup() {
    log.info('Starting MCP Server setup...');

    // 1. Install dependencies
    log.info('Installing dependencies...');
    if (!run('npm install')) {
        process.exit(1);
    }
    log.success('Dependencies installed');

    // 2. Build the project
    log.info('Building project...');
    if (!run('npm run build')) {
        process.exit(1);
    }
    log.success('Project built');

    // 3. Create clients.js if it doesn't exist
    if (!existsSync('clients.js')) {
        log.info('Creating clients.js...');
        run('copy clients.js.example clients.js');
    }
    log.success('Setup complete!');

    // Print usage instructions
    console.log('\nTo start the server:');
    console.log('1. Run: node clients.js');
    console.log('2. In Cursor:');
    console.log('   - Go to Settings > MCP Servers');
    console.log('   - Add new server:');
    console.log('     Name: AI');
    console.log('     Type: stdio');
    console.log(`     Command: node ${resolve(process.cwd(), 'clients.js')}`);
}

setup().catch(error => {
    log.error('Setup failed:');
    log.error(error.message);
    process.exit(1);
}); 
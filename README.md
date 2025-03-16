# 🤖 AI Development Assistant MCP Server

Welcome to your AI-powered development toolkit, designed as a Model Context Protocol (MCP) server for Cursor! This project provides intelligent coding assistance through custom AI tools. Note that this is mostly a tutorial demo, and not a production-ready tool.

## ✨ Features

### 🎨 Code Architect

Call advanced reasoning LLMs to generate plans and instructions for coding agents.

### 📸 Screenshot Buddy

Take UI design screenshots and use them with the composer agent.

### 🔍 Code Review

Use git diffs to trigger code reviews.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 7.0.0
- Cursor Editor

### Installation

1. Clone or download this repository:
```bash
git clone <repository-url>
# or download and extract the zip file
```

2. Navigate to the project directory:
```bash
cd mcp
```

3. Run the setup script:
```bash
node setup.js
```

The setup script will:
- Install all dependencies
- Build the project
- Create necessary configuration files
- Show you the exact command to use in Cursor

### Starting the Server

```bash
node clients.js
```

### Configuring Cursor

1. Open Cursor
2. Go to Settings > MCP Servers
3. Add a new MCP server:
   - Name: AI (or any name you prefer)
   - Type: stdio
   - Command: `node path/to/your/mcp/clients.js`
   - (The setup script will show you the exact full path)
4. Click Save

## 🛠️ Available Tools

### 📸 Screenshot Tool
- Captures screenshots of web pages
- Supports both full URLs and local paths
- Saves screenshots to specified locations

### 🎨 Architect Tool
- Analyzes code structure
- Provides implementation suggestions
- Helps with architectural decisions

### 🔍 Code Review Tool
- Performs git-based code reviews
- Shows diffs against main branch
- Provides review suggestions

### 📝 Journaling Tool
- Start development sessions
- Record progress notes
- Get session summaries
- View recent entries

## 📦 Project Structure

```
mcp/
├── src/               # Source code
│   ├── tools/        # Tool implementations
│   └── index.ts      # Main server file
├── clients.js        # Client script for running the server
├── setup.js          # Setup and configuration script
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## 🔧 Development

### Building
```bash
npm run build
```

### Running in Development
```bash
npm start
```

### Packaging
```bash
npm run package
```

## 🚨 Troubleshooting

If the server doesn't start:
1. Check if Node.js and npm are installed correctly
2. Make sure you ran the setup script
3. Verify the path in your Cursor MCP settings
4. Check the console output for any error messages

The client script will automatically find the server in these locations:
- Same directory as clients.js
- One directory up from clients.js
- Global npm installation
- Current working directory

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📫 Support

Found a bug or need help? Open an issue with:
1. What you were trying to do
2. What happened instead
3. Steps to reproduce
4. Your environment details

---

I'll be honest though, this is a tutorial demo, and not a production-ready tool so I likely won't be fixing issues. But feel free to fork it and make it your own!

Made with ❤️ by developers, for developers

# MCP Server

A Model Context Protocol (MCP) server providing four powerful Cursor tools:
1. Screenshot - Capture screenshots of web pages
2. Architect - Analyze code and provide architectural insights
3. Code Review - Perform git-based code reviews
4. Journaling - Keep track of development sessions

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 7.0.0
- Cursor Editor

### Installation

1. Clone or download this repository:
```bash
git clone <repository-url>
# or download and extract the zip file
```

2. Navigate to the project directory:
```bash
cd mcp
```

3. Run the setup script:
```bash
node setup.js
```

The setup script will:
- Install all dependencies
- Build the project
- Create necessary configuration files
- Show you the exact command to use in Cursor

### Starting the Server

```bash
node clients.js
```

### Configuring Cursor

1. Open Cursor
2. Go to Settings > MCP Servers
3. Add a new MCP server:
   - Name: AI (or any name you prefer)
   - Type: stdio
   - Command: `node path/to/your/mcp/clients.js`
   - (The setup script will show you the exact full path)
4. Click Save

## 🛠️ Available Tools

### 📸 Screenshot Tool
- Captures screenshots of web pages
- Supports both full URLs and local paths
- Saves screenshots to specified locations

### 🎨 Architect Tool
- Analyzes code structure
- Provides implementation suggestions
- Helps with architectural decisions

### 🔍 Code Review Tool
- Performs git-based code reviews
- Shows diffs against main branch
- Provides review suggestions

### 📝 Journaling Tool
- Start development sessions
- Record progress notes
- Get session summaries
- View recent entries

## 📦 Project Structure

```
mcp/
├── src/               # Source code
│   ├── tools/        # Tool implementations
│   └── index.ts      # Main server file
├── clients.js        # Client script for running the server
├── setup.js          # Setup and configuration script
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## 🔧 Development

### Building
```bash
npm run build
```

### Running in Development
```bash
npm start
```

### Packaging
```bash
npm run package
```

## 🚨 Troubleshooting

If the server doesn't start:
1. Check if Node.js and npm are installed correctly
2. Make sure you ran the setup script
3. Verify the path in your Cursor MCP settings
4. Check the console output for any error messages

The client script will automatically find the server in these locations:
- Same directory as clients.js
- One directory up from clients.js
- Global npm installation
- Current working directory

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📫 Support

Found a bug or need help? Open an issue with:
1. What you were trying to do
2. What happened instead
3. Steps to reproduce
4. Your environment details

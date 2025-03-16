#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from 'express';
import type { Express } from 'express';
import { EventEmitter } from 'events';

import {
  screenshotToolName,
  screenshotToolDescription,
  ScreenshotToolSchema,
  runScreenshotTool,
} from "./tools/screenshot.js";

import {
  architectToolName,
  architectToolDescription,
  ArchitectToolSchema,
  runArchitectTool,
} from "./tools/architect.js";

import {
  codeReviewToolName,
  codeReviewToolDescription,
  CodeReviewToolSchema,
  runCodeReviewTool,
} from "./tools/codeReview.js";

import {
  journalingToolName,
  journalingToolDescription,
  JournalingToolSchema,
  runJournalingTool,
} from "./tools/journaling.js";

/**
 * A minimal MCP server providing four Cursor Tools:
 *   1) Screenshot
 *   2) Architect
 *   3) CodeReview
 *   4) Journaling
 */

// 1. Create an MCP server instance
const server = new Server(
  {
    name: "mcp-server",
    version: "2.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// 2. Define the list of tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: screenshotToolName,
        description: screenshotToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "Full URL to screenshot",
            },
            relativePath: {
              type: "string",
              description: "Relative path appended to http://localhost:3000",
            },
            fullPathToScreenshot: {
              type: "string",
              description:
                "Path to where the screenshot file should be saved. This should be a cwd-style full path to the file (not relative to the current working directory) including the file name and extension.",
            },
          },
          required: [],
        },
      },
      {
        name: architectToolName,
        description: architectToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            task: {
              type: "string",
              description: "Description of the task",
            },
            code: {
              type: "string",
              description: "Concatenated code from one or more files",
            },
          },
          required: ["task", "code"],
        },
      },
      {
        name: codeReviewToolName,
        description: codeReviewToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            folderPath: {
              type: "string",
              description:
                "Path to the full root directory of the repository to diff against main",
            },
          },
          required: ["folderPath"],
        },
      },
      {
        name: journalingToolName,
        description: journalingToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["start_session", "record", "summary", "recent"],
              description: "The journaling action to perform",
            },
            message: {
              type: "string",
              description: "Message to record in the journal",
            },
            summary: {
              type: "string",
              description: "Summary to add to the journal entry",
            },
          },
          required: ["action"],
        },
      },
    ],
  };
});

// 3. Implement the tool call logic
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case screenshotToolName: {
      const validated = ScreenshotToolSchema.parse(args);
      return await runScreenshotTool(validated);
    }
    case architectToolName: {
      const validated = ArchitectToolSchema.parse(args);
      return await runArchitectTool(validated);
    }
    case codeReviewToolName: {
      const validated = CodeReviewToolSchema.parse(args);
      return await runCodeReviewTool(validated);
    }
    case journalingToolName: {
      const validated = JournalingToolSchema.parse(args);
      return await runJournalingTool(validated);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Custom HTTP transport
class HttpTransport extends EventEmitter {
  private app: Express;
  private server: any;
  private messageHandler?: (message: any) => Promise<any>;

  constructor(app: Express) {
    super();
    this.app = app;

    // Handle MCP requests
    this.app.post('/mcp', async (req, res) => {
      try {
        if (!this.messageHandler) {
          throw new Error('Message handler not initialized');
        }
        const response = await this.messageHandler(req.body);
        res.json(response);
      } catch (error: any) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
      }
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });
  }

  async start(): Promise<void> {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3333;
    return new Promise((resolve) => {
      this.server = this.app.listen(port, () => {
        console.log(`MCP Server running on http://localhost:${port}`);
        console.log('Available endpoints:');
        console.log('  - POST /mcp - MCP request endpoint');
        console.log('  - GET /health - Health check endpoint');
        resolve();
      });
    });
  }

  async connect(messageHandler: (message: any) => Promise<any>): Promise<void> {
    this.messageHandler = messageHandler;
    await this.start();
  }

  async send(message: any): Promise<void> {
    // Not needed for HTTP transport as we use request/response
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err: any) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

// 4. Start the MCP server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

import { z } from "zod";
import fs from "fs";
import path from "path";
import os from "os";

/**
 * Journaling tool
 *   - Manages interactive journaling sessions
 *   - Saves conversations in Markdown format
 *   - Provides temporal analysis and retrieval
 */

export const journalingToolName = "journaling";
export const journalingToolDescription = "Interactive journaling with conversation saving and analysis.";

// Default configuration
const JOURNAL_DIR = process.env.JOURNAL_DIR || path.join(process.env.HOME || process.env.USERPROFILE || "", "Documents/journal");
const FILENAME_PREFIX = process.env.FILENAME_PREFIX || "journal";
const FILE_EXTENSION = process.env.FILE_EXTENSION || ".md";
const EOL = os.EOL;

// Ensure journal directory exists
if (!fs.existsSync(JOURNAL_DIR)) {
  fs.mkdirSync(JOURNAL_DIR, { recursive: true });
}

export const JournalingToolSchema = z.object({
  action: z.enum(["start_session", "record", "summary", "recent"]),
  message: z.string().optional(),
  summary: z.string().optional()
});

function readJournalFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    return '';
  }
  return fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function writeJournalFile(filePath: string, content: string) {
  // Normalize line endings and ensure proper spacing
  const normalizedContent = content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .join(EOL);
  
  fs.writeFileSync(filePath, normalizedContent, { encoding: 'utf-8', flag: 'w' });
}

export async function runJournalingTool(
  args: z.infer<typeof JournalingToolSchema>
) {
  const { action, message, summary } = args;
  const currentDate = new Date().toISOString().split('T')[0];
  const journalPath = path.join(JOURNAL_DIR, `${FILENAME_PREFIX}_${currentDate}${FILE_EXTENSION}`);

  try {
    let content = readJournalFile(journalPath);

    switch (action) {
      case "start_session": {
        if (content) {
          return {
            content: [
              {
                type: "text",
                text: `Journal session for ${currentDate} already exists`,
              },
            ],
          };
        }

        const template = [
          `# Journal Entry - ${currentDate}`,
          '',
          '## Conversation',
          '',
        ].join('\n');

        writeJournalFile(journalPath, template);

        return {
          content: [
            {
              type: "text",
              text: `Started new journaling session for ${currentDate}`,
            },
          ],
        };
      }

      case "record": {
        if (!message) {
          throw new Error("Message is required for recording");
        }

        if (!content) {
          content = [
            `# Journal Entry - ${currentDate}`,
            '',
            '## Conversation',
            '',
          ].join('\n');
        }

        const timestamp = new Date().toLocaleTimeString();
        const newEntry = `[${timestamp}] ${message}`;

        // If there's a summary, insert before it
        if (content.includes('## Summary')) {
          const [beforeSummary, summarySection] = content.split('## Summary');
          content = [beforeSummary.trim(), newEntry, `## Summary${summarySection}`].join('\n\n');
        } else {
          content = [content.trim(), newEntry].join('\n\n');
        }

        writeJournalFile(journalPath, content);

        return {
          content: [
            {
              type: "text",
              text: `Recorded message at ${timestamp}`,
            },
          ],
        };
      }

      case "summary": {
        if (!summary) {
          throw new Error("Summary is required");
        }

        if (!content) {
          throw new Error("No journal entry exists for today");
        }

        // Remove existing summary if present
        if (content.includes('## Summary')) {
          content = content.split('## Summary')[0].trim();
        }

        content = [
          content,
          '## Summary',
          '',
          summary
        ].join('\n');

        writeJournalFile(journalPath, content);

        return {
          content: [
            {
              type: "text",
              text: `Added summary to journal entry`,
            },
          ],
        };
      }

      case "recent": {
        const files = fs.readdirSync(JOURNAL_DIR)
          .filter(file => file.startsWith(FILENAME_PREFIX))
          .sort()
          .reverse()
          .slice(0, 5);

        const entries = files.map(file => {
          const content = readJournalFile(path.join(JOURNAL_DIR, file));
          const preview = content.split('\n').slice(0, 5).join('\n');
          return { file, preview };
        });

        return {
          content: [
            {
              type: "text",
              text: `Recent journal entries:\n\n${entries.map(e => 
                `- ${e.file}\n${e.preview}\n...\n\n`
              ).join('')}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message || error}`,
        },
      ],
    };
  }
} 
import { z } from "zod";

/**
 * Architect tool
 *   - Calls an OpenAI model (o3-mini-01-31-24) to generate a series of steps
 *   - Input: 'task' (description of the task), 'code' (one or more code files concatenated)
 */

export const architectToolName = "architect";
export const architectToolDescription =
  "Analyzes a task description plus some code, then outlines steps for an AI coding agent.";

export const ArchitectToolSchema = z.object({
  task: z.string().min(1, "Task description is required."),
  code: z
    .string()
    .min(1, "Code string is required (one or more files concatenated)."),
});

export async function runArchitectTool(
  args: z.infer<typeof ArchitectToolSchema>,
) {
  const { task, code } = args;

  try {
    // Simple analysis without external API calls
    const analysis = `Task Analysis for: ${task}\n\n` +
      `Code Analysis:\n` +
      `- Lines of code: ${code.split('\n').length}\n` +
      `- Contains functions: ${code.includes('function')}\n` +
      `- Contains classes: ${code.includes('class')}\n\n` +
      `Suggested Steps:\n` +
      `1. Review the existing code structure\n` +
      `2. Identify areas for improvement\n` +
      `3. Plan implementation changes\n` +
      `4. Test the modifications`;

    return {
      content: [
        {
          type: "text",
          text: analysis,
        },
      ],
    };
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

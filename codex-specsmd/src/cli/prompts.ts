import { createInterface } from "node:readline/promises";
import type { Readable, Writable } from "node:stream";

export type Prompt = (label: string) => Promise<string>;

export function createTerminalPrompt(input: Readable, output: Writable): Prompt {
  return async (label) => {
    const terminal = createInterface({ input, output });
    try {
      return await terminal.question(`${label}: `);
    } finally {
      terminal.close();
    }
  };
}

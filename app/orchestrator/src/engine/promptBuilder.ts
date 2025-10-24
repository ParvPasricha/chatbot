import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';

const distPath = path.join(__dirname, '../config/prompts/agent.md');
const srcPath = path.join(process.cwd(), 'app/orchestrator/src/config/prompts/agent.md');
const templatePath = fs.existsSync(distPath) ? distPath : srcPath;
const template = fs.readFileSync(templatePath, 'utf-8');

interface PromptVariables {
  business: Record<string, unknown>;
  tenant: Record<string, unknown>;
  brand: Record<string, unknown>;
  env: string;
  integrations: Record<string, unknown>;
}

export const buildPrompt = (variables: PromptVariables) => Mustache.render(template, variables);

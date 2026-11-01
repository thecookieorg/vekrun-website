/**
 * The tools Vekrun works with, grouped by what they do for you. Logos are
 * trademarks of their owners and show compatibility, never endorsement.
 * `id` keys the logo in IntegrationLogo; `mono` is the fallback monogram.
 */
export type Tool = { id: string; name: string; mono: string };
export type ToolGroup = { key: string; title: string; line: string; tools: Tool[] };

export const toolGroups: ToolGroup[] = [
  {
    key: 'agents',
    title: 'Coding agents and models',
    line: 'Use the agents you already pay for. Add any model through OpenRouter.',
    tools: [
      { id: 'claude-code', name: 'Claude Code', mono: 'Cc' },
      { id: 'codex', name: 'Codex', mono: 'Cx' },
      { id: 'gemini-cli', name: 'Gemini CLI', mono: 'Gc' },
      { id: 'openrouter', name: 'OpenRouter', mono: 'Or' },
      { id: 'anthropic', name: 'Anthropic API', mono: 'An' },
      { id: 'openai', name: 'OpenAI API', mono: 'Oa' },
      { id: 'gemini', name: 'Google Gemini API', mono: 'Gm' },
    ],
  },
  {
    key: 'git',
    title: 'Git and source control',
    line: 'Branches, pull requests and CI, on the hosts you use now.',
    tools: [
      { id: 'github', name: 'GitHub', mono: 'Gh' },
      { id: 'gitlab', name: 'GitLab', mono: 'Gl' },
      { id: 'github-actions', name: 'GitHub Actions', mono: 'Ga' },
      { id: 'gitlab-ci', name: 'GitLab CI', mono: 'Gc' },
      { id: 'git', name: 'Any Git remote', mono: 'Gt' },
    ],
  },
  {
    key: 'pm',
    title: 'Project management',
    line: 'Tickets become work. Progress goes back where your team looks for it.',
    tools: [
      { id: 'jira', name: 'Jira', mono: 'Ji' },
      { id: 'linear', name: 'Linear', mono: 'Li' },
      { id: 'asana', name: 'Asana', mono: 'As' },
      { id: 'github-issues', name: 'GitHub Issues', mono: 'Gi' },
      { id: 'gitlab-issues', name: 'GitLab Issues', mono: 'Gi' },
      { id: 'confluence', name: 'Confluence', mono: 'Co' },
      { id: 'notion', name: 'Notion', mono: 'No' },
    ],
  },
  {
    key: 'monitoring',
    title: 'Monitoring',
    line: 'A production error turns into a fix with evidence, not a forgotten alert.',
    tools: [
      { id: 'sentry', name: 'Sentry', mono: 'Se' },
      { id: 'honeybadger', name: 'Honeybadger', mono: 'Hb' },
      { id: 'datadog', name: 'Datadog', mono: 'Dd' },
      { id: 'appsignal', name: 'AppSignal', mono: 'Ap' },
      { id: 'pagerduty', name: 'PagerDuty', mono: 'Pd' },
    ],
  },
  {
    key: 'services',
    title: 'Cloud and development services',
    line: 'The services your app runs on, available to agents with your permission.',
    tools: [
      { id: 'docker', name: 'Docker', mono: 'Dk' },
      { id: 'cloudflare', name: 'Cloudflare', mono: 'Cf' },
      { id: 'vercel', name: 'Vercel', mono: 'Vc' },
      { id: 'supabase', name: 'Supabase', mono: 'Su' },
      { id: 'postgres', name: 'PostgreSQL', mono: 'Pg' },
      { id: 'stripe', name: 'Stripe', mono: 'St' },
      { id: 'figma', name: 'Figma', mono: 'Fi' },
      { id: 'slack', name: 'Slack', mono: 'Sl' },
    ],
  },
  {
    key: 'local',
    title: 'Local AI',
    line: 'Run models on your own hardware when the code shouldn’t leave it.',
    tools: [
      { id: 'ollama', name: 'Ollama', mono: 'Ol' },
      { id: 'lm-studio', name: 'LM Studio', mono: 'Lm' },
      { id: 'llama-cpp', name: 'llama.cpp', mono: 'Ll' },
    ],
  },
];

/** Platforms and ecosystems Vekrun is built to coordinate whole products across. */
export const platforms: Tool[] = [
  { id: 'expo', name: 'Expo', mono: 'Ex' },
  { id: 'rails', name: 'Rails', mono: 'Rb' },
  { id: 'nextjs', name: 'Next.js', mono: 'Nx' },
  { id: 'shopify', name: 'Shopify', mono: 'Sh' },
  { id: 'supabase', name: 'Supabase', mono: 'Su' },
  { id: 'firebase', name: 'Firebase', mono: 'Fb' },
  { id: 'flutter', name: 'Flutter', mono: 'Fl' },
  { id: 'tauri', name: 'Tauri', mono: 'Ta' },
  { id: 'swift', name: 'Swift', mono: 'Sw' },
  { id: 'kotlin', name: 'Kotlin', mono: 'Kt' },
];

/** The coding agents shown wherever the site says "your agents". */
export const agentIds = ['claude-code', 'codex', 'gemini-cli', 'openrouter'] as const;
export const allTools = toolGroups.flatMap((g) => g.tools);
export const toolById = (id: string) => [...allTools, ...platforms].find((t) => t.id === id);

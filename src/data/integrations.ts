/**
 * The tools Vekrun works with, grouped by what they do for you. Logos are
 * trademarks of their owners and show compatibility, never endorsement.
 * `id` keys the logo in IntegrationLogo; `mono` is the fallback monogram.
 */
export type Tool = { id: string; name: string; mono: string };
/**
 * `agents`: the coding CLIs and model connections that do the work.
 * `native`: services Vekrun connects to directly. Anything else connects as an
 * MCP server the customer adds (see the Integrations page), never as a claim here.
 */
export type ToolGroup = { key: string; kind: 'agents' | 'native'; title: string; line: string; tools: Tool[] };

export const toolGroups: ToolGroup[] = [
  {
    key: 'agents',
    kind: 'agents',
    title: 'Coding agents',
    line: 'The official CLIs, signed in with your own accounts. Each Factory task runs in its own isolated VM.',
    tools: [
      { id: 'claude-code', name: 'Claude Code', mono: 'Cc' },
      { id: 'codex', name: 'Codex', mono: 'Cx' },
      { id: 'antigravity', name: 'Antigravity CLI', mono: 'Ag' },
    ],
  },
  {
    key: 'models',
    kind: 'agents',
    title: 'Models',
    line: 'Hosted models through one OpenRouter key, or open-weight models that never leave your machine.',
    tools: [
      { id: 'openrouter', name: 'OpenRouter', mono: 'Or' },
      { id: 'ollama', name: 'Ollama', mono: 'Ol' },
      { id: 'lm-studio', name: 'LM Studio', mono: 'Lm' },
    ],
  },
  {
    key: 'pm',
    kind: 'native',
    title: 'Work tracking',
    line: 'Issues on the Board, and new ones created from incidents and reviews.',
    tools: [
      { id: 'jira', name: 'Jira', mono: 'Ji' },
      { id: 'linear', name: 'Linear', mono: 'Li' },
      { id: 'asana', name: 'Asana', mono: 'As' },
    ],
  },
  {
    key: 'git',
    kind: 'native',
    title: 'Code hosting and CI',
    line: 'Pull and merge requests, checks, pipelines and code scanning. GitLab.com or self-managed.',
    tools: [
      { id: 'github', name: 'GitHub', mono: 'Gh' },
      { id: 'gitlab', name: 'GitLab', mono: 'Gl' },
      { id: 'github-actions', name: 'GitHub Actions', mono: 'Ga' },
      { id: 'gitlab-ci', name: 'GitLab CI', mono: 'Gc' },
    ],
  },
  {
    key: 'monitoring',
    kind: 'native',
    title: 'Production monitoring',
    line: 'Errors and incidents land in Insights, and the Factory investigates them.',
    tools: [
      { id: 'sentry', name: 'Sentry', mono: 'Se' },
      { id: 'honeybadger', name: 'Honeybadger', mono: 'Hb' },
      { id: 'appsignal', name: 'AppSignal', mono: 'Ap' },
      { id: 'datadog', name: 'Datadog', mono: 'Dd' },
    ],
  },
  {
    key: 'context',
    kind: 'native',
    title: 'Docs, designs and notes',
    line: 'Specs, designs, conversations and your team’s notes, as context for the Council and agents.',
    tools: [
      { id: 'notion', name: 'Notion', mono: 'No' },
      { id: 'confluence', name: 'Confluence', mono: 'Co' },
      { id: 'figma', name: 'Figma', mono: 'Fi' },
      { id: 'slack', name: 'Slack', mono: 'Sl' },
      { id: 'obsidian', name: 'Obsidian vaults', mono: 'Ob' },
    ],
  },
];

/** Connections that exist in the product's design but haven't shipped. Shown only as planned. */
export const plannedConnections: string[] = ['Asana tools for agents, alongside the Asana Board integration'];

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
export const agentIds = ['claude-code', 'codex', 'antigravity', 'openrouter'] as const;
export const allTools = toolGroups.flatMap((g) => g.tools);
export const toolById = (id: string) => [...allTools, ...platforms].find((t) => t.id === id);

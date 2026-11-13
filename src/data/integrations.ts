/**
 * The tools Vekrun works with, grouped by what they do for you. Logos are
 * trademarks of their owners and show compatibility, never endorsement.
 * `id` keys the logo in IntegrationLogo; `mono` is the fallback monogram.
 */
export type Tool = { id: string; name: string; mono: string };
/**
 * `models`: what Vekrun's native agent runs on. This comes first: no coding-agent
 * CLI is required. `agents`: optional third-party coding-agent CLIs.
 * `native`: services Vekrun connects to directly. Anything else connects as an
 * MCP server the customer adds (see the Integrations page), never as a claim here.
 */
export type ToolGroup = { key: string; kind: 'models' | 'agents' | 'native'; title: string; line: string; tools: Tool[] };

export const toolGroups: ToolGroup[] = [
  {
    key: 'models',
    kind: 'models',
    title: 'Vekrun’s native agent',
    line: 'Vekrun’s own agent does the work. Connect hosted models through OpenRouter, or run open-weight models on your own hardware.',
    tools: [
      { id: 'openrouter', name: 'OpenRouter', mono: 'Or' },
      { id: 'ollama', name: 'Ollama', mono: 'Ol' },
      { id: 'lm-studio', name: 'LM Studio', mono: 'Lm' },
    ],
  },
  {
    key: 'agents',
    kind: 'agents',
    title: 'Optional coding agents',
    line: 'Prefer a coding-agent CLI? Bring it, signed in with your own account. Each Factory task runs in its own isolated VM. None of them is required.',
    tools: [
      { id: 'claude-code', name: 'Claude Code', mono: 'Cc' },
      { id: 'codex', name: 'Codex', mono: 'Cx' },
      { id: 'antigravity', name: 'Antigravity CLI', mono: 'Ag' },
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

/**
 * The stacks Vekrun works in, shown in the homepage marquees. Vekrun works in
 * the repository and with the project's own tooling; this is not a claim of
 * platform-specific verification for each one.
 */
export const stackRows: Tool[][] = [
  [
    { id: 'rails', name: 'Ruby on Rails', mono: 'Rr' },
    { id: 'laravel', name: 'Laravel', mono: 'La' },
    { id: 'django', name: 'Django', mono: 'Dj' },
    { id: 'nodejs', name: 'Node.js', mono: 'No' },
    { id: 'nextjs', name: 'Next.js', mono: 'Nx' },
    { id: 'react', name: 'React', mono: 'Re' },
    { id: 'python', name: 'Python', mono: 'Py' },
    { id: 'typescript', name: 'TypeScript', mono: 'Ts' },
    { id: 'ruby', name: 'Ruby', mono: 'Rb' },
    { id: 'php', name: 'PHP', mono: 'Ph' },
    { id: 'go', name: 'Go', mono: 'Go' },
    { id: 'rust', name: 'Rust', mono: 'Rs' },
    { id: 'vue', name: 'Vue', mono: 'Vu' },
    { id: 'svelte', name: 'Svelte', mono: 'Sv' },
  ],
  [
    { id: 'expo', name: 'Expo', mono: 'Ex' },
    { id: 'react-native', name: 'React Native', mono: 'Rn' },
    { id: 'flutter', name: 'Flutter', mono: 'Fl' },
    { id: 'swift', name: 'Swift', mono: 'Sw' },
    { id: 'kotlin', name: 'Kotlin', mono: 'Kt' },
    { id: 'tauri', name: 'Tauri', mono: 'Ta' },
    { id: 'electron', name: 'Electron', mono: 'El' },
    { id: 'postgres', name: 'PostgreSQL', mono: 'Pg' },
    { id: 'mysql', name: 'MySQL', mono: 'My' },
    { id: 'redis', name: 'Redis', mono: 'Rd' },
    { id: 'docker', name: 'Docker', mono: 'Dk' },
    { id: 'supabase', name: 'Supabase', mono: 'Su' },
    { id: 'shopify', name: 'Shopify', mono: 'Sh' },
    { id: 'firebase', name: 'Firebase', mono: 'Fb' },
  ],
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

/** Model connections for the native agent, and the optional coding-agent CLIs. */
export const modelIds = ['openrouter', 'ollama', 'lm-studio'] as const;
export const agentIds = ['claude-code', 'codex', 'antigravity'] as const;
export const allTools = toolGroups.flatMap((g) => g.tools);
export const toolById = (id: string) => [...allTools, ...platforms, ...stackRows.flat()].find((t) => t.id === id);

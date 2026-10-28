/**
 * Status of each product capability, reconciled with the desktop project on
 * 2026-10-28 (desktop main at #242, the vault work log and the pivot tracker).
 * Feature pages show these badges; never restate a status in page copy.
 *
 * available       = verified in the development build with automated tests (macOS)
 * in-development  = partly built, or tested only against recorded responses
 * planned         = approved direction, nothing complete in the product yet
 */
import type { Availability } from './site';

export type Capability = { label: string; status: Availability; note?: string };

export const capabilities = {
  coordinator: { label: 'Conversational Coordinator and outcome entry', status: 'in-development', note: 'A Coordinator panel and new-work entry exist; the outcome-first Factory home is being built.' },
  concurrentJobs: { label: 'Several jobs across several projects', status: 'in-development', note: 'Concurrency limits and a queue exist; priority scheduling is still to come.' },
  council: { label: 'Council for hard problems', status: 'available' },
  workItems: { label: 'Durable Work Items', status: 'in-development' },
  isolatedVm: { label: 'An isolated VM per Work Item', status: 'in-development', note: 'A VM backend passes an isolation test on macOS; linking it to Work Items is next.' },
  mcpBridge: { label: 'One Vekrun MCP bridge from host CLIs to the VM', status: 'planned' },
  envDiscovery: { label: 'Environment Discovery for Docker, native and hybrid projects', status: 'in-development', note: 'Discovers and runs real projects on the host today; reusable Environment Recipes are planned.' },
  envRecipes: { label: 'Reusable Environment Recipes', status: 'planned' },
  livePreview: { label: 'Live preview of a running job', status: 'in-development' },
  projectImport: { label: 'Clone by URL or open a local repository', status: 'in-development', note: 'Clone by URL and open a local folder work; repository browsing and Fork & Clone are planned.' },
  forkClone: { label: 'Browse repositories and Fork & Clone', status: 'planned' },
  claudeCode: { label: 'Claude Code', status: 'available', note: 'Run end to end with a signed-in Claude Code on the host.' },
  codex: { label: 'Codex', status: 'in-development', note: 'Tested against a stand-in binary; no live run yet.' },
  geminiCli: { label: 'Gemini CLI', status: 'planned' },
  cliSetup: { label: 'CLI discovery, versions and health', status: 'in-development', note: 'Claude Code and Codex versions and sign-in are detected; install and update are planned.' },
  cliInstall: { label: 'Install and update coding CLIs', status: 'planned' },
  githubCli: { label: 'GitHub CLI', status: 'planned' },
  routing: { label: 'Automatic model routing', status: 'available', note: 'For API connections.' },
  failover: { label: 'Fallback to another provider', status: 'in-development', note: 'One fallback at a turn boundary exists.' },
  contextHandoff: { label: 'Vekrun Context Handoff', status: 'planned' },
  openrouter: { label: 'OpenRouter', status: 'in-development', note: 'Tested against recorded responses; live run pending.' },
  board: { label: 'Board across trackers and repositories', status: 'in-development', note: 'Jira, Linear, Asana, GitHub and GitLab adapters are tested against recorded responses only.' },
  statusSync: { label: 'Two-way status and field mapping', status: 'in-development' },
  monitoring: { label: 'Production incidents from monitoring', status: 'in-development', note: 'Sentry, Honeybadger, Datadog and AppSignal are tested against recorded responses only.' },
  incidentDedupe: { label: 'One shared Work Item per incident', status: 'planned' },
  inbox: { label: 'Inbox for approvals, questions and reviews', status: 'available' },
  verifier: { label: 'Independent verifier', status: 'available' },
  qualityGates: { label: 'Quality gates from test evidence', status: 'in-development' },
  proofPacks: { label: 'Proof Packs', status: 'planned' },
  verificationProfiles: { label: 'Verification Profiles and Feature Maps', status: 'planned' },
  browserChecks: { label: 'Browser checks, screenshots and video', status: 'planned' },
  memory: { label: 'Engineering Memory', status: 'in-development', note: 'Execution history, scoped memory and an audit journal exist; search and curated knowledge are being built.' },
  insights: { label: 'Engineering Insights reporting', status: 'planned' },
  audit: { label: 'Audit journal', status: 'available' },
  budgets: { label: 'Budgets and cost tracking', status: 'available', note: 'Actual cost where the provider reports it.' },
  hostService: { label: 'Background Host service', status: 'in-development' },
  keepAwake: { label: 'Keep Host Awake', status: 'planned' },
  mobile: { label: 'Vekrun Mobile for iOS and Android', status: 'planned' },
  teamsCoordinator: { label: 'Self-hosted Teams Coordinator', status: 'planned' },
  sso: { label: 'SSO', status: 'planned' },
  orgRoles: { label: 'Organization roles and permissions', status: 'planned' },
  workers: { label: 'Customer-owned workers', status: 'in-development', note: 'Personal remote hosts over SSH exist; Teams worker management is planned.' },
  prCreation: { label: 'Pull request creation', status: 'available' },
  aiReview: { label: 'AI pull request review', status: 'in-development' },
  ciRuns: { label: 'CI runs', status: 'available' },
  terminal: { label: 'Terminal, tabs, splits and SSH', status: 'available' },
  codeView: { label: 'Code and diff view with language servers', status: 'available' },
} satisfies Record<string, Capability>;

export type CapabilityKey = keyof typeof capabilities;

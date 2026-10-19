/**
 * A tiny runtime for scripted product demonstrations.
 *
 * A demo is a list of steps with a time offset. The runtime plays them when the
 * root scrolls into view, exposes play / pause / replay, and under reduced
 * motion (or when asked) jumps straight to the final state. Every demo is
 * markup first: the final state must be readable with the script disabled.
 */
export type Step = { t: number; run: () => void };

export interface SequenceOptions {
  /** Start automatically when 35% of the root is visible. Default true. */
  autoplay?: boolean;
  /** Loop after this many ms of rest at the end. Omit for no loop. */
  loopAfter?: number;
  /** Called before every (re)start so the demo can reset its DOM. */
  reset: () => void;
  /** Called after a reduced-motion jump to the end. Optional. */
  onFinish?: () => void;
}

export interface Sequence {
  play(): void;
  pause(): void;
  replay(): void;
  finish(): void;
  readonly playing: boolean;
}

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function createSequence(root: HTMLElement, steps: Step[], opts: SequenceOptions): Sequence {
  const ordered = [...steps].sort((a, b) => a.t - b.t);
  const total = ordered.length ? ordered[ordered.length - 1]!.t : 0;
  let index = 0;
  let elapsed = 0;
  let startedAt = 0;
  let timer: number | null = null;
  let playing = false;
  let finished = false;

  const setState = (s: 'idle' | 'playing' | 'paused' | 'done') => { root.dataset.demo = s; };

  const schedule = () => {
    if (timer !== null) { clearTimeout(timer); timer = null; }
    if (index >= ordered.length) {
      playing = false; finished = true; setState('done'); opts.onFinish?.();
      if (opts.loopAfter) timer = window.setTimeout(() => replay(), opts.loopAfter);
      return;
    }
    const next = ordered[index]!;
    const wait = Math.max(0, next.t - (elapsed + (performance.now() - startedAt)));
    timer = window.setTimeout(() => {
      while (index < ordered.length && ordered[index]!.t <= elapsed + (performance.now() - startedAt) + 1) {
        ordered[index]!.run(); index++;
      }
      schedule();
    }, wait);
  };

  const play = () => {
    if (playing) return;
    if (finished) { opts.reset(); index = 0; elapsed = 0; finished = false; }
    playing = true; startedAt = performance.now(); setState('playing'); schedule();
  };
  const pause = () => {
    if (!playing) return;
    elapsed += performance.now() - startedAt; playing = false; setState('paused');
    if (timer !== null) { clearTimeout(timer); timer = null; }
  };
  const replay = () => {
    if (timer !== null) { clearTimeout(timer); timer = null; }
    playing = false; finished = false; index = 0; elapsed = 0;
    opts.reset(); play();
  };
  const finish = () => {
    if (timer !== null) { clearTimeout(timer); timer = null; }
    opts.reset(); ordered.forEach((s) => s.run()); index = ordered.length; elapsed = total;
    playing = false; finished = true; setState('done'); opts.onFinish?.();
  };

  // Controls inside the root, if present.
  root.querySelector<HTMLElement>('[data-demo-play]')?.addEventListener('click', () => (playing ? pause() : play()));
  root.querySelector<HTMLElement>('[data-demo-replay]')?.addEventListener('click', replay);

  // Pause when the tab is hidden; resume on return.
  document.addEventListener('visibilitychange', () => { if (document.hidden && playing) pause(); });

  opts.reset(); setState('idle');

  if (reducedMotion()) { finish(); }
  else if (opts.autoplay !== false) {
    if (!('IntersectionObserver' in window)) play();
    else {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !finished && !playing) play();
          else if (!e.isIntersecting && playing) pause();
        }
      }, { threshold: 0.35 });
      io.observe(root);
    }
  }

  return { play, pause, replay, finish, get playing() { return playing; } };
}

/** Type `text` into `el` one character at a time, starting at `t`. Returns the steps and the end time. */
export function typeSteps(el: () => HTMLElement | null, text: string, t: number, cps = 28): { steps: Step[]; end: number } {
  const steps: Step[] = [];
  const dt = 1000 / cps;
  for (let i = 1; i <= text.length; i++) {
    const slice = text.slice(0, i);
    steps.push({ t: Math.round(t + i * dt), run: () => { const n = el(); if (n) n.textContent = slice; } });
  }
  return { steps, end: Math.round(t + text.length * dt) };
}

/** Append a line of (trusted, authored) HTML to a terminal element, trimming old lines to the visible height. */
export function appendLine(term: HTMLElement, html: string, cls?: string) {
  const span = document.createElement('span');
  span.className = `term-line${cls ? ' ' + cls : ''}`;
  span.innerHTML = html;
  term.appendChild(span);
  while (term.scrollHeight > term.clientHeight + 2 && term.children.length > 1) term.removeChild(term.firstChild!);
}

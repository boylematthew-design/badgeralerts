// robotsAnalyzer.ts
// Pure, dependency-free robots.txt parser that returns plain-English (ELI5) explanations.
// Tone rule: we explain and suggest, we never declare something "wrong".
//
// Converted from robotsAnalyzer.js to TypeScript — logic, strings and behaviour are
// unchanged from the original; only type annotations were added so it compiles under
// this project's strict TypeScript config.

const KNOWN_BOTS: Record<string, string> = {
  '*': 'every bot that doesn’t have its own section further down',
  googlebot: 'Google’s main search crawler',
  'googlebot-image': 'Google’s image search crawler',
  'googlebot-news': 'Google News’ crawler',
  'googlebot-video': 'Google’s video crawler',
  'adsbot-google': 'Google Ads’ page checker',
  'mediapartners-google': 'Google AdSense’s crawler',
  bingbot: 'Bing’s search crawler (also powers DuckDuckGo and Yahoo results)',
  slurp: 'Yahoo’s crawler',
  duckduckbot: 'DuckDuckGo’s crawler',
  baiduspider: 'Baidu (Chinese search engine)',
  yandex: 'Yandex (Russian search engine)',
  yandexbot: 'Yandex (Russian search engine)',
  applebot: 'Apple’s crawler for Siri and Spotlight suggestions',
  facebookexternalhit: 'Facebook’s link-preview fetcher',
  twitterbot: 'X/Twitter’s link-preview fetcher',
  linkedinbot: 'LinkedIn’s link-preview fetcher',
  ahrefsbot: 'Ahrefs (SEO tool)',
  semrushbot: 'Semrush (SEO tool)',
  mj12bot: 'Majestic (SEO tool)',
  dotbot: 'Moz (SEO tool)',
};

export const AI_BOTS: Record<string, string> = {
  gptbot: 'OpenAI — collects pages to train ChatGPT’s models',
  'oai-searchbot': 'OpenAI — powers ChatGPT’s search results',
  'chatgpt-user': 'ChatGPT — visits a page when a user asks it to',
  claudebot: 'Anthropic — collects pages to train Claude’s models',
  'claude-searchbot': 'Anthropic — powers Claude’s search results',
  'claude-user': 'Claude — visits a page when a user asks it to',
  perplexitybot: 'Perplexity — AI search engine',
  'google-extended': 'Google — Gemini AI training (doesn’t affect normal Google Search)',
  'applebot-extended': 'Apple — AI training (doesn’t affect Siri or Spotlight)',
  ccbot: 'Common Crawl — an open dataset many AI companies train on',
  bytespider: 'ByteDance (TikTok’s parent company)',
  'meta-externalagent': 'Meta — AI training',
};

const DIRECTIVES = ['user-agent', 'disallow', 'allow', 'sitemap', 'crawl-delay', 'host', 'noindex', 'clean-param'];

const ASSET_HINTS = /(wp-content|wp-includes|\.css|\.js|\/css\b|\/js\b|\/assets|\/static|\/images|\/img\b|\/media)/i;

export interface RobotsRule {
  type: 'disallow' | 'allow';
  value: string;
}

export interface RobotsGroup {
  agents: string[];
  rules: RobotsRule[];
  startLine: number;
}

export interface RobotsLine {
  lineNo: number;
  text: string;
  kind: string;
  tone?: 'note';
  explanation: string;
}

export interface RobotsNote {
  kind?: 'info';
  title: string;
  body: string;
}

export type BotStatus = 'allowed' | 'partial' | 'blocked';

export interface AiBotInfo {
  key: string;
  name: string;
  desc: string;
  status: BotStatus;
  source: 'own' | 'general' | 'none';
}

export interface AnalyzeResult {
  lines: RobotsLine[];
  notes: RobotsNote[];
  groups: RobotsGroup[];
  sitemaps: string[];
  aiBots: AiBotInfo[];
  headline: string;
  stats: { rules: number; groups: number; notes: number };
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

function closestDirective(word: string): string | null {
  let best: string | null = null, bestDist = 3;
  for (const d of DIRECTIVES) {
    const dist = levenshtein(word, d);
    if (dist < bestDist) { best = d; bestDist = dist; }
  }
  return best;
}

const pretty = (d: string): string => d.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('-');

function describeAgent(agent: string): string {
  const key = agent.toLowerCase();
  if (KNOWN_BOTS[key]) return KNOWN_BOTS[key];
  if (AI_BOTS[key]) return AI_BOTS[key];
  return `a bot that calls itself “${agent}”`;
}

function audience(agents?: string[]): string {
  if (!agents || agents.length === 0) return 'bots';
  if (agents.includes('*')) return agents.length === 1 ? 'all bots' : 'these bots';
  if (agents.length === 1) return agents[0];
  return 'these bots';
}

// Turns a robots.txt path pattern into plain English.
export function describePath(p: string): string {
  if (p === '/' || p === '/*') return 'the whole site';
  const endsHere = p.endsWith('$');
  const core = endsHere ? p.slice(0, -1) : p;
  const ext = core.match(/^\/?\*\.([a-z0-9]+)$/i);
  if (ext) return `any URL ending in .${ext[1]}`;
  if (core === '/*?' || core === '/*?*') return 'any URL containing a ? (usually filters, sorting or search results)';
  if (core === '/*?s=' || core === '/?s=') return 'your site’s search results pages (on WordPress, these are URLs containing ?s=)';
  const contains = core.match(/^\/\*([^*]+)$/);
  if (contains && !endsHere) return `any URL containing “${contains[1]}”`;
  if (core.includes('*')) {
    return `URLs matching “${p}” (the * means “anything can go here”${endsHere ? ' and the $ means “the URL ends here”' : ''})`;
  }
  if (endsHere) return `exactly the URL ${core} and nothing beneath it`;
  if (core.endsWith('/')) return `anything inside the ${core} folder`;
  if (/\.[a-z0-9]{2,5}$/i.test(core)) return `the file ${core}`;
  return `any URL starting with ${core}`;
}

function groupStatus(rules: RobotsRule[]): BotStatus {
  const dis = rules.filter((r) => r.type === 'disallow' && r.value !== '');
  const allowAll = rules.some((r) => r.type === 'allow' && (r.value === '/' || r.value === '/*'));
  const blocksAll = dis.some((r) => r.value === '/' || r.value === '/*');
  if (blocksAll && !allowAll && rules.filter((r) => r.type === 'allow').length === 0) return 'blocked';
  if (blocksAll) return 'partial';
  if (dis.length > 0) return 'partial';
  return 'allowed';
}

export function analyzeRobots(text: string): AnalyzeResult {
  const result: AnalyzeResult = {
    lines: [],
    notes: [],
    groups: [],
    sitemaps: [],
    aiBots: [],
    headline: '',
    stats: { rules: 0, groups: 0, notes: 0 },
  };

  const raw = (text || '').replace(/^﻿/, '');
  const bytes = typeof Blob !== 'undefined' ? new Blob([raw]).size : raw.length;

  if (!raw.trim()) {
    result.headline = 'This file is empty, which simply means every bot is free to crawl every page.';
    return result;
  }

  if (/<html|<!doctype/i.test(raw)) {
    result.notes.push({
      title: 'This looks like a web page rather than a robots.txt file',
      body: 'If you visited yourdomain.com/robots.txt and got an HTML page back, your site may not have a robots.txt file at all. Bots treat that as “everything is open”, which is often fine, but it’s worth knowing.',
    });
  }

  if (bytes > 500 * 1024) {
    result.notes.push({
      title: 'This file is very large',
      body: 'Google only reads the first 500 KB of a robots.txt file and ignores anything after that. Rules near the bottom may not be seen.',
    });
  }

  let current: RobotsGroup | null = null; // current group
  let lastWasAgent = false;
  const agentSeen: Record<string, number> = {};

  raw.split(/\r?\n/).forEach((line, idx) => {
    const lineNo = idx + 1;
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('#')) {
      result.lines.push({ lineNo, text: trimmed, kind: 'comment', explanation: 'A comment for humans. Bots ignore it.' });
      return;
    }

    const content = trimmed.replace(/\s+#.*$/, '').trim();
    const m = content.match(/^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.*)$/);
    if (!m) {
      result.lines.push({
        lineNo, text: trimmed, kind: 'unknown', tone: 'note',
        explanation: 'Bots can’t read this line because it isn’t in the usual “Name: value” format, so they’ll most likely skip it.',
      });
      return;
    }

    const directive = m[1].toLowerCase();
    const value = m[2].trim();
    const entry: RobotsLine = { lineNo, text: trimmed, kind: directive, explanation: '' };

    switch (directive) {
      case 'user-agent': {
        if (!current || !lastWasAgent) {
          current = { agents: [], rules: [], startLine: lineNo };
          result.groups.push(current);
        }
        current!.agents.push(value);
        const key = value.toLowerCase();
        agentSeen[key] = (agentSeen[key] || 0) + 1;
        entry.explanation = value === '*'
          ? 'Starts a section of rules for everyone: every bot that doesn’t have its own section.'
          : `Starts a section of rules for ${value}: ${describeAgent(value)}.`;
        lastWasAgent = true;
        break;
      }
      case 'disallow':
      case 'allow': {
        lastWasAgent = false;
        result.stats.rules++;
        const who = current ? audience(current.agents) : 'bots';
        if (!current) {
          entry.tone = 'note';
          entry.explanation = 'This rule sits above any User-agent line, so bots don’t know who it’s meant for and will probably ignore it.';
        } else if (directive === 'disallow') {
          current.rules.push({ type: 'disallow', value });
          if (value === '') {
            entry.explanation = `An empty Disallow means nothing is off-limits. ${capital(who)} can go anywhere.`;
          } else {
            entry.explanation = `Asks ${who} not to visit ${describePath(value)}.`;
            if ((value === '/' || value === '/*') && current.agents.some((a) => a === '*' || /^googlebot$|^bingbot$/i.test(a))) {
              entry.tone = 'note';
              entry.explanation += ' That’s intentional on staging or private sites. If this is your live site and you want to show up in search, it’s worth double-checking.';
            } else if (ASSET_HINTS.test(value)) {
              entry.tone = 'note';
              entry.explanation += ' This kind of folder often holds images, styling or scripts. Google likes to see those to understand how your pages look, so it may be worth checking nothing important is tucked away here.';
            }
          }
        } else {
          current.rules.push({ type: 'allow', value });
          entry.explanation = `Makes an exception: ${who} may visit ${describePath(value)}, even if a broader rule says otherwise. When two rules overlap, Google goes with the more specific (longer) one.`;
        }
        if (value && !/^[\/*]/.test(value)) {
          entry.tone = 'note';
          entry.explanation += ' Paths usually start with a /. Adding one removes any doubt about what’s meant.';
        }
        break;
      }
      case 'sitemap': {
        result.sitemaps.push(value);
        if (/^https?:\/\//i.test(value)) {
          entry.explanation = 'Points bots to your sitemap, a list of the pages you’d like them to find. It applies to every bot, wherever it sits in the file.';
        } else {
          entry.tone = 'note';
          entry.explanation = 'Points bots to your sitemap. Sitemap addresses are normally written as a full URL including https://, so some bots may not follow this one.';
        }
        break;
      }
      case 'crawl-delay':
        lastWasAgent = false;
        entry.explanation = `Asks ${current ? audience(current.agents) : 'bots'} to wait ${value || 'a few'} second${value === '1' ? '' : 's'} between page visits. Bing and some others respect this. Google ignores it.`;
        break;
      case 'host':
        entry.explanation = 'Used by Yandex in the past to choose a preferred version of your domain. Most search engines ignore it today.';
        break;
      case 'clean-param':
        entry.explanation = 'A Yandex-only instruction for ignoring certain URL parameters. Other search engines skip it.';
        break;
      case 'noindex':
        entry.tone = 'note';
        entry.explanation = 'Google stopped reading noindex in robots.txt in 2019, so this line probably isn’t doing anything. A noindex tag on the page itself is the supported way to keep a page out of results.';
        break;
      default: {
        const guess = closestDirective(directive);
        entry.tone = 'note';
        entry.explanation = `Bots don’t recognise “${m[1]}”, so they’ll most likely skip this line.` +
          (guess ? ` Did you mean “${pretty(guess)}”?` : '');
      }
    }
    if (directive !== 'user-agent') lastWasAgent = false;
    result.lines.push(entry);
  });

  result.stats.groups = result.groups.length;

  // ----- File-wide observations (all phrased as suggestions) -----
  const starGroup = result.groups.find((g) => g.agents.includes('*'));
  const namedSearchBots = result.groups
    .flatMap((g) => g.agents)
    .filter((a) => a !== '*' && !AI_BOTS[a.toLowerCase()]);

  if (starGroup && namedSearchBots.length) {
    result.notes.push({
      title: 'Some bots have their own section',
      body: `${listify(namedSearchBots)} ${namedSearchBots.length === 1 ? 'has its' : 'have their'} own rules, so ${namedSearchBots.length === 1 ? 'it follows' : 'they follow'} only that section and skip the general (*) one entirely. That’s often deliberate, but it’s a common surprise, so it’s worth checking the important rules appear in both places.`,
    });
  }

  const dupes = Object.keys(agentSeen).filter((k) => agentSeen[k] > 1);
  if (dupes.length) {
    result.notes.push({
      title: 'The same bot appears in more than one section',
      body: `${listify(dupes)} ${dupes.length === 1 ? 'is' : 'are'} named more than once. Google combines the sections, but other bots may only read the first one. Merging them keeps things predictable.`,
    });
  }

  if (result.sitemaps.length === 0 && result.groups.length) {
    result.notes.push({
      title: 'No sitemap listed',
      body: 'Not essential, but adding a Sitemap line is an easy way to help search engines find all your pages.',
    });
  }

  if (result.groups.some((g) => g.rules.some((r) => r.type === 'disallow' && r.value))) {
    result.notes.push({
      kind: 'info',
      title: 'Good to know: blocking isn’t hiding',
      body: 'Robots.txt asks bots not to visit pages. It doesn’t guarantee those pages stay out of search results. If other sites link to them, Google can still list the address. And because the file is public, it’s not a place to hide anything private.',
    });
  }

  // ----- AI crawler summary -----
  result.aiBots = Object.entries(AI_BOTS).map(([key, desc]): AiBotInfo => {
    const own = result.groups.find((g) => g.agents.some((a) => a.toLowerCase() === key));
    const group = own || starGroup;
    const status: BotStatus = group ? groupStatus(group.rules) : 'allowed';
    return { key, name: displayName(key), desc, status, source: own ? 'own' : starGroup ? 'general' : 'none' };
  });

  // ----- Headline -----
  result.stats.notes = result.notes.filter((n) => n.kind !== 'info').length + result.lines.filter((l) => l.tone === 'note').length;
  const starStatus: BotStatus = starGroup ? groupStatus(starGroup.rules) : 'allowed';
  let headline: string;
  if (starStatus === 'blocked') headline = 'Your file asks bots to stay away from the whole site.';
  else if (starStatus === 'partial') {
    const n = starGroup!.rules.filter((r) => r.type === 'disallow' && r.value).length;
    headline = `Your file lets bots into most of your site, with ${n} area${n === 1 ? '' : 's'} marked as off-limits.`;
  } else headline = 'Your file lets bots explore the whole site freely.';
  if (result.stats.notes) headline += ` There ${result.stats.notes === 1 ? 'is 1 thing' : `are ${result.stats.notes} things`} that might be worth a second look.`;
  result.headline = headline;

  return result;
}

function capital(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }
function listify(arr: string[]): string {
  if (arr.length <= 1) return arr.join('');
  return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
}
function displayName(key: string): string {
  const names: Record<string, string> = {
    gptbot: 'GPTBot', 'oai-searchbot': 'OAI-SearchBot', 'chatgpt-user': 'ChatGPT-User',
    claudebot: 'ClaudeBot', 'claude-searchbot': 'Claude-SearchBot', 'claude-user': 'Claude-User',
    perplexitybot: 'PerplexityBot', 'google-extended': 'Google-Extended', 'applebot-extended': 'Applebot-Extended',
    ccbot: 'CCBot', bytespider: 'Bytespider', 'meta-externalagent': 'Meta-ExternalAgent',
  };
  return names[key] || key;
}

export const EXAMPLE_ROBOTS = `# Example robots.txt
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Disallow: /wp-content/
Disallow: /*?s=

User-agent: GPTBot
Disallow: /

Sitemap: https://example.com/sitemap.xml`;

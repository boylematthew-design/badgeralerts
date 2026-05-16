// Static illustration components ported from the Claude-designed prototype.
// Each renders a mini UI mockup (browser, inbox, or guide panel) using si-* CSS classes.

export function CompetitorScanImage() {
  return (
    <div className="si-frame">
      <div className="si-browser">
        <div className="si-chrome">
          <span className="si-dot si-dot-r" />
          <span className="si-dot si-dot-y" />
          <span className="si-dot si-dot-g" />
          <div className="si-urlbar">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <span>oakhillplumbing.co.uk</span>
          </div>
        </div>
        <div className="si-body si-comp-body">
          <div className="si-comp-left">
            <div className="si-comp-logo">
              <span className="si-comp-mark">OH</span>
              <div>
                <div className="si-bar w70" />
                <div className="si-bar w40 dim" />
              </div>
            </div>
            <div className="si-comp-headline">
              <div className="si-bar w80 tall" />
              <div className="si-bar w55 tall" />
            </div>
            <div className="si-bar w90 dim" />
            <div className="si-bar w70 dim" />
            <div className="si-comp-btn">Book now →</div>
          </div>
          <div className="si-mappanel">
            <div className="si-map">
              <svg className="si-roads" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M-5 60 Q 30 35 70 50 T 110 35" stroke="#E0DCD3" strokeWidth="6" fill="none" strokeLinecap="round" />
                <path d="M30 -5 Q 45 30 35 60 T 50 110" stroke="#EDEAE2" strokeWidth="5" fill="none" strokeLinecap="round" />
                <path d="M60 -5 L 65 110" stroke="#EDEAE2" strokeWidth="3" fill="none" />
                <path d="M-5 25 L 110 18" stroke="#EDEAE2" strokeWidth="3" fill="none" />
                <rect x="8" y="68" width="18" height="14" rx="2" fill="#E8F4DC" />
                <rect x="74" y="72" width="22" height="20" rx="2" fill="#DDEFE3" />
              </svg>
              <div className="si-pin si-pin-ad" style={{ left: "46%", top: "38%" }}>
                <span className="si-pin-badge">Ad</span>
              </div>
              <div className="si-pin si-pin-org" style={{ left: "24%", top: "64%" }} />
              <div className="si-pin si-pin-org" style={{ left: "74%", top: "56%" }} />
              <div className="si-scan-ring" />
            </div>
            <div className="si-map-legend">
              <span className="si-leg-dot si-leg-ad" /> Sponsored
              <span className="si-leg-dot si-leg-org" /> Organic
            </div>
          </div>
        </div>
      </div>
      <div className="si-tag si-tag-bl">
        <span className="si-tag-dot" />
        Scanning…
      </div>
    </div>
  );
}

export function EmailAlertImage() {
  return (
    <div className="si-frame">
      <div className="si-inbox">
        <div className="si-inbox-head">
          <div className="si-inbox-tab is-on">Inbox <span className="si-pill">3</span></div>
          <div className="si-inbox-tab">Starred</div>
          <div className="si-inbox-tab">Sent</div>
        </div>
        <div className="si-mail si-mail-unread">
          <div className="si-mail-avatar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" />
            </svg>
          </div>
          <div className="si-mail-body">
            <div className="si-mail-row">
              <span className="si-mail-from">BadgerAlerts</span>
              <span className="si-mail-time">9:42 AM</span>
            </div>
            <div className="si-mail-subject">A competitor just launched a new local ad</div>
            <div className="si-mail-preview">Oak Hill Plumbing is now bidding on local map results in your area — here&apos;s what they&apos;re targeting and how to respond…</div>
            <div className="si-mail-chips">
              <span className="si-chip si-chip-acc">Competitor</span>
              <span className="si-chip">Local ads</span>
              <span className="si-chip">High priority</span>
            </div>
          </div>
          <span className="si-unread-dot" />
        </div>
        <div className="si-mail">
          <div className="si-mail-avatar si-avatar-flat" style={{ background: "#FEF3E2", color: "#854F0B" }}>WS</div>
          <div className="si-mail-body">
            <div className="si-mail-row">
              <span className="si-mail-from si-from-dim">Weekly summary</span>
              <span className="si-mail-time si-from-dim">Yesterday</span>
            </div>
            <div className="si-mail-subject si-subject-dim">Your week at a glance — 4 alerts, 2 wins</div>
          </div>
        </div>
        <div className="si-mail">
          <div className="si-mail-avatar si-avatar-flat" style={{ background: "#EBF3FE", color: "#1F4FA8" }}>RR</div>
          <div className="si-mail-body">
            <div className="si-mail-row">
              <span className="si-mail-from si-from-dim">Ranking report</span>
              <span className="si-mail-time si-from-dim">2 days ago</span>
            </div>
            <div className="si-mail-subject si-subject-dim">You moved up 3 places for &quot;emergency plumber Bath&quot;</div>
          </div>
        </div>
      </div>
      <div className="si-tag si-tag-tr">
        <span className="si-tag-dot si-tag-dot-acc" />
        New alert
      </div>
    </div>
  );
}

export function CampaignSetupImage() {
  return (
    <div className="si-frame">
      <div className="si-guide">
        <div className="si-guide-head">
          <span className="si-guide-eyebrow">Guide · Local ads</span>
          <span className="si-guide-meta">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
            </svg>
            4 min read
          </span>
        </div>
        <div className="si-guide-title">How local ads work</div>
        <div className="si-guide-sub">Chapter 2 of 5 · The local pack</div>
        <div className="si-pack">
          <div className="si-pack-row si-pack-ad">
            <div className="si-pack-marker">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7.6 2 4 5.6 4 10c0 5.5 8 12 8 12s8-6.5 8-12c0-4.4-3.6-8-8-8z" /></svg>
            </div>
            <div className="si-pack-body">
              <div className="si-pack-row-top">
                <span className="si-pack-name">Oak Hill Plumbing</span>
                <span className="si-pack-ad-pill">Ad</span>
              </div>
              <div className="si-pack-stars">
                <span className="si-stars">★★★★★</span>
                <span className="si-pack-rating">4.9 · Plumber</span>
              </div>
            </div>
          </div>
          <div className="si-pack-row">
            <div className="si-pack-marker si-pack-marker-org">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7.6 2 4 5.6 4 10c0 5.5 8 12 8 12s8-6.5 8-12c0-4.4-3.6-8-8-8z" /></svg>
            </div>
            <div className="si-pack-body">
              <div className="si-pack-row-top">
                <span className="si-pack-name si-pack-name-dim">Riverside Plumbers</span>
              </div>
              <div className="si-pack-stars">
                <span className="si-stars si-stars-dim">★★★★★</span>
                <span className="si-pack-rating">4.7 · Plumber</span>
              </div>
            </div>
          </div>
          <div className="si-pack-row si-pack-row-faint">
            <div className="si-pack-marker si-pack-marker-org">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7.6 2 4 5.6 4 10c0 5.5 8 12 8 12s8-6.5 8-12c0-4.4-3.6-8-8-8z" /></svg>
            </div>
            <div className="si-pack-body">
              <div className="si-pack-row-top">
                <span className="si-pack-name si-pack-name-dim">Bath Drain Co.</span>
              </div>
              <div className="si-pack-stars">
                <span className="si-stars si-stars-dim">★★★★★</span>
                <span className="si-pack-rating">4.5 · Plumber</span>
              </div>
            </div>
          </div>
        </div>
        <div className="si-callout">
          <span className="si-callout-icon">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.7.7 1 1.6 1 2.5v.8h6v-.8c0-.9.3-1.8 1-2.5A7 7 0 0 0 12 2z" />
            </svg>
          </span>
          <span><strong>Key takeaway:</strong> Sponsored pins appear above organic results — even brand-new businesses can outrank long-established competitors.</span>
        </div>
        <div className="si-guide-foot">
          <div className="si-guide-progress">
            <div className="si-guide-bar"><div className="si-guide-bar-fill" /></div>
            <span className="si-guide-progress-label">40%</span>
          </div>
          <span className="si-guide-next">Next: Setting your radius →</span>
        </div>
      </div>
      <div className="si-tag si-tag-bl">
        <span className="si-tag-dot si-tag-dot-acc" />
        Chapter 2 of 5
      </div>
    </div>
  );
}

export function SeoScanImage() {
  return (
    <div className="si-frame">
      <div className="si-browser">
        <div className="si-chrome">
          <span className="si-dot si-dot-r" />
          <span className="si-dot si-dot-y" />
          <span className="si-dot si-dot-g" />
          <div className="si-urlbar">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <span>badgeralerts.live / scan</span>
          </div>
        </div>
        <div className="si-body si-seo-body">
          <div className="si-seo-graph">
            <svg className="si-seo-edges" viewBox="0 0 200 130" preserveAspectRatio="none">
              <line x1="100" y1="65" x2="32" y2="22" stroke="#D9D7D0" strokeWidth="1" strokeDasharray="2 3" />
              <line x1="100" y1="65" x2="170" y2="20" stroke="#D9D7D0" strokeWidth="1" strokeDasharray="2 3" />
              <line x1="100" y1="65" x2="22" y2="78" stroke="#1DB973" strokeWidth="1.4" />
              <line x1="100" y1="65" x2="180" y2="55" stroke="#1DB973" strokeWidth="1.4" />
              <line x1="100" y1="65" x2="50" y2="115" stroke="#D9D7D0" strokeWidth="1" strokeDasharray="2 3" />
              <line x1="100" y1="65" x2="160" y2="110" stroke="#1DB973" strokeWidth="1.4" />
            </svg>
            <div className="si-node si-node-hub">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
              </svg>
            </div>
            <span className="si-node-label si-node-label-hub">yoursite.co.uk</span>
            <div className="si-node si-node-op si-node-hi" style={{ left: "14%", top: "60%" }}>
              <span className="si-node-pulse" />
            </div>
            <span className="si-node-label" style={{ left: "14%", top: "78%" }}>&ldquo;emergency…&rdquo;</span>
            <div className="si-node si-node-op si-node-hi" style={{ left: "82%", top: "42%" }} />
            <span className="si-node-label si-node-label-right" style={{ left: "82%", top: "60%" }}>&ldquo;boiler grants&rdquo;</span>
            <div className="si-node si-node-op si-node-hi" style={{ left: "72%", top: "82%" }} />
            <span className="si-node-label si-node-label-right" style={{ left: "72%", top: "94%" }}>&ldquo;hot water&rdquo;</span>
            <div className="si-node si-node-op" style={{ left: "18%", top: "17%" }} />
            <div className="si-node si-node-op" style={{ left: "80%", top: "15%" }} />
            <div className="si-node si-node-op" style={{ left: "28%", top: "88%" }} />
          </div>
          <div className="si-seo-side">
            <div className="si-seo-side-head">
              <span className="si-seo-side-title">Opportunities</span>
              <span className="si-seo-side-count">12</span>
            </div>
            <div className="si-seo-row">
              <div className="si-seo-row-top">
                <span className="si-seo-row-name">emergency plumber</span>
                <span className="si-seo-intent">High</span>
              </div>
              <div className="si-seo-row-meta">2.4k / mo · KD 18</div>
            </div>
            <div className="si-seo-row">
              <div className="si-seo-row-top">
                <span className="si-seo-row-name">boiler grants UK</span>
                <span className="si-seo-intent">High</span>
              </div>
              <div className="si-seo-row-meta">1.9k / mo · KD 22</div>
            </div>
            <div className="si-seo-row si-seo-row-dim">
              <div className="si-seo-row-top">
                <span className="si-seo-row-name si-pack-name-dim">leaking radiator</span>
                <span className="si-seo-intent si-seo-intent-med">Med</span>
              </div>
              <div className="si-seo-row-meta">880 / mo · KD 14</div>
            </div>
          </div>
        </div>
      </div>
      <div className="si-tag si-tag-tr">
        <span className="si-tag-dot si-tag-dot-acc" />
        Crawling…
      </div>
    </div>
  );
}

export function SeoEmailImage() {
  return (
    <div className="si-frame">
      <div className="si-inbox">
        <div className="si-inbox-head">
          <div className="si-inbox-tab is-on">Inbox <span className="si-pill">2</span></div>
          <div className="si-inbox-tab">Starred</div>
          <div className="si-inbox-tab">Sent</div>
        </div>
        <div className="si-mail si-mail-unread">
          <div className="si-mail-avatar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" />
            </svg>
          </div>
          <div className="si-mail-body">
            <div className="si-mail-row">
              <span className="si-mail-from">BadgerAlerts</span>
              <span className="si-mail-time">8:14 AM</span>
            </div>
            <div className="si-mail-subject">3 high-intent pages we recommend you build</div>
            <div className="si-mail-preview">We found search queries your customers are typing in right now that your site doesn&apos;t yet rank for — here&apos;s what to build first…</div>
            <div className="si-mail-chips">
              <span className="si-chip si-chip-acc">SEO</span>
              <span className="si-chip">Content</span>
              <span className="si-chip">Recommended</span>
            </div>
          </div>
          <span className="si-unread-dot" />
        </div>
        <div className="si-mail">
          <div className="si-mail-avatar si-avatar-flat" style={{ background: "#FEF3E2", color: "#854F0B" }}>WS</div>
          <div className="si-mail-body">
            <div className="si-mail-row">
              <span className="si-mail-from si-from-dim">Weekly summary</span>
              <span className="si-mail-time si-from-dim">Yesterday</span>
            </div>
            <div className="si-mail-subject si-subject-dim">Your week at a glance — 4 alerts, 2 wins</div>
          </div>
        </div>
        <div className="si-mail">
          <div className="si-mail-avatar si-avatar-flat" style={{ background: "#EBF3FE", color: "#1F4FA8" }}>RR</div>
          <div className="si-mail-body">
            <div className="si-mail-row">
              <span className="si-mail-from si-from-dim">Ranking report</span>
              <span className="si-mail-time si-from-dim">2 days ago</span>
            </div>
            <div className="si-mail-subject si-subject-dim">You moved up 3 places for &quot;emergency plumber Bath&quot;</div>
          </div>
        </div>
      </div>
      <div className="si-tag si-tag-tr">
        <span className="si-tag-dot si-tag-dot-acc" />
        New recommendation
      </div>
    </div>
  );
}

export function SeoReportImage() {
  return (
    <div className="si-frame">
      <div className="si-guide">
        <div className="si-guide-head">
          <span className="si-guide-eyebrow">Report · Content</span>
          <span className="si-guide-meta">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h4" />
            </svg>
            12 pages
          </span>
        </div>
        <div className="si-guide-title">Build: &ldquo;Emergency plumber Bath&rdquo;</div>
        <div className="si-guide-sub">High intent · 2,400 searches/mo</div>
        <div className="si-report-grid">
          <div className="si-stat">
            <div className="si-stat-label">Search volume</div>
            <div className="si-stat-value">2.4k<span className="si-stat-unit">/mo</span></div>
          </div>
          <div className="si-stat">
            <div className="si-stat-label">Difficulty</div>
            <div className="si-stat-value">18<span className="si-stat-unit">/100</span></div>
            <div className="si-stat-bar"><div className="si-stat-bar-fill" style={{ width: "18%" }} /></div>
          </div>
          <div className="si-stat">
            <div className="si-stat-label">Intent</div>
            <div className="si-stat-value si-stat-value-acc">High</div>
          </div>
        </div>
        <div className="si-outline">
          <div className="si-outline-head">Suggested page outline</div>
          <div className="si-outline-row">
            <span className="si-outline-tag">H1</span>
            <span className="si-outline-text">Emergency plumber in Bath · 24/7 callout</span>
          </div>
          <div className="si-outline-row">
            <span className="si-outline-tag">H2</span>
            <span className="si-outline-text">What counts as a plumbing emergency?</span>
          </div>
          <div className="si-outline-row">
            <span className="si-outline-tag">H2</span>
            <span className="si-outline-text">Our 60-minute response promise</span>
          </div>
          <div className="si-outline-row">
            <span className="si-outline-tag">H2</span>
            <span className="si-outline-text">Pricing &amp; call-out fees</span>
          </div>
        </div>
        <div className="si-guide-foot">
          <div className="si-guide-progress">
            <div className="si-guide-bar"><div className="si-guide-bar-fill" style={{ width: "60%" }} /></div>
            <span className="si-guide-progress-label">Step 3 of 5</span>
          </div>
          <span className="si-guide-next">Help me build this →</span>
        </div>
      </div>
      <div className="si-tag si-tag-bl">
        <span className="si-tag-dot si-tag-dot-acc" />
        Full report
      </div>
    </div>
  );
}

export function TechScanImage() {
  return (
    <div className="si-frame">
      <div className="si-browser">
        <div className="si-chrome">
          <span className="si-dot si-dot-r" />
          <span className="si-dot si-dot-y" />
          <span className="si-dot si-dot-g" />
          <div className="si-urlbar">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <span>yoursite.co.uk · audit</span>
          </div>
        </div>
        <div className="si-body si-tech-body">
          <div className="si-wireframe">
            <div className="si-wf-nav">
              <div className="si-wf-logo" />
              <div className="si-wf-navlinks">
                <span /><span /><span /><span />
              </div>
            </div>
            <div className="si-wf-hero">
              <div className="si-bar w70 tall" />
              <div className="si-bar w55 tall" />
              <div className="si-bar w40 dim" />
            </div>
            <div className="si-wf-row">
              <div className="si-wf-img">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" />
                </svg>
              </div>
              <div className="si-wf-body">
                <div className="si-bar w90 dim" />
                <div className="si-bar w80 dim" />
                <div className="si-bar w70 dim" />
              </div>
            </div>
            <div className="si-spider">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="11" r="4" fill="currentColor" />
                <path d="M8 8 L4 5 M8 11 L3 11 M8 14 L4 17 M16 8 L20 5 M16 11 L21 11 M16 14 L20 17" />
                <circle cx="10.5" cy="10" r="0.8" fill="#fff" stroke="none" />
                <circle cx="13.5" cy="10" r="0.8" fill="#fff" stroke="none" />
                <path d="M12 4 V0" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <svg className="si-spider-trail" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 6 12 L 50 12 L 50 38 L 18 38 L 18 60 L 82 60 L 82 82" stroke="#1DB973" strokeWidth="0.5" strokeDasharray="1.5 2" fill="none" />
            </svg>
            <div className="si-flag si-flag-err" style={{ left: "8%", top: "57%" }}>
              <span className="si-flag-icon">!</span>
              <span className="si-flag-text">No alt text</span>
            </div>
            <div className="si-flag si-flag-warn" style={{ left: "60%", top: "15%" }}>
              <span className="si-flag-icon">!</span>
              <span className="si-flag-text">Missing meta</span>
            </div>
          </div>
          <div className="si-tech-counter">
            <div className="si-tech-counter-row">
              <span className="si-counter-dot si-counter-dot-err" />
              <span className="si-counter-num">3</span>
              <span className="si-counter-label">Critical</span>
            </div>
            <div className="si-tech-counter-row">
              <span className="si-counter-dot si-counter-dot-warn" />
              <span className="si-counter-num">7</span>
              <span className="si-counter-label">Warnings</span>
            </div>
            <div className="si-tech-counter-row">
              <span className="si-counter-dot si-counter-dot-ok" />
              <span className="si-counter-num">24</span>
              <span className="si-counter-label">Passing</span>
            </div>
          </div>
        </div>
      </div>
      <div className="si-tag si-tag-tr">
        <span className="si-tag-dot si-tag-dot-acc" />
        Crawling site
      </div>
    </div>
  );
}

export function TechEmailImage() {
  return (
    <div className="si-frame">
      <div className="si-inbox">
        <div className="si-inbox-head">
          <div className="si-inbox-tab is-on">Inbox <span className="si-pill">1</span></div>
          <div className="si-inbox-tab">Starred</div>
          <div className="si-inbox-tab">Sent</div>
        </div>
        <div className="si-mail si-mail-unread">
          <div className="si-mail-avatar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" />
            </svg>
          </div>
          <div className="si-mail-body">
            <div className="si-mail-row">
              <span className="si-mail-from">BadgerAlerts</span>
              <span className="si-mail-time">10:21 AM</span>
            </div>
            <div className="si-mail-subject">We found 3 technical issues hurting your site</div>
            <div className="si-mail-preview">Your homepage is loading slowly on mobile, and a few key pages are missing meta data Google needs — here&apos;s what to fix first…</div>
            <div className="si-mail-chips">
              <span className="si-chip si-chip-acc">Technical</span>
              <span className="si-chip">Performance</span>
              <span className="si-chip">Critical</span>
            </div>
          </div>
          <span className="si-unread-dot" />
        </div>
        <div className="si-mail">
          <div className="si-mail-avatar si-avatar-flat" style={{ background: "#FEF3E2", color: "#854F0B" }}>WS</div>
          <div className="si-mail-body">
            <div className="si-mail-row">
              <span className="si-mail-from si-from-dim">Weekly summary</span>
              <span className="si-mail-time si-from-dim">Yesterday</span>
            </div>
            <div className="si-mail-subject si-subject-dim">Your week at a glance — 4 alerts, 2 wins</div>
          </div>
        </div>
        <div className="si-mail">
          <div className="si-mail-avatar si-avatar-flat" style={{ background: "#EBF3FE", color: "#1F4FA8" }}>RR</div>
          <div className="si-mail-body">
            <div className="si-mail-row">
              <span className="si-mail-from si-from-dim">Ranking report</span>
              <span className="si-mail-time si-from-dim">2 days ago</span>
            </div>
            <div className="si-mail-subject si-subject-dim">You moved up 3 places for &quot;emergency plumber Bath&quot;</div>
          </div>
        </div>
      </div>
      <div className="si-tag si-tag-tr">
        <span className="si-tag-dot si-tag-dot-acc" />
        New issue found
      </div>
    </div>
  );
}

export function TechFixGuideImage() {
  return (
    <div className="si-frame">
      <div className="si-guide">
        <div className="si-guide-head">
          <span className="si-guide-eyebrow">Fix · Performance</span>
          <span className="si-guide-meta">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
            </svg>
            5 min fix
          </span>
        </div>
        <div className="si-guide-title">Speed up your homepage</div>
        <div className="si-guide-sub">4 images are over 1MB · dragging load time</div>
        <div className="si-ba">
          <div className="si-ba-card">
            <div className="si-ba-label">Before</div>
            <div className="si-ba-value">4.2<span className="si-ba-unit">s</span></div>
            <div className="si-ba-bar"><div className="si-ba-bar-fill" style={{ width: "85%", background: "#E0867A" }} /></div>
          </div>
          <div className="si-ba-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div className="si-ba-card si-ba-after">
            <div className="si-ba-label">After</div>
            <div className="si-ba-value">1.8<span className="si-ba-unit">s</span></div>
            <div className="si-ba-bar"><div className="si-ba-bar-fill" style={{ width: "36%", background: "#1DB973" }} /></div>
          </div>
        </div>
        <div className="si-checklist">
          <div className="si-check-row si-check-done">
            <span className="si-check-box">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m4 12 5 5 11-12" />
              </svg>
            </span>
            <span className="si-check-text">Identify oversized images</span>
          </div>
          <div className="si-check-row si-check-on">
            <span className="si-check-box" />
            <span className="si-check-text">Compress to WebP (we&apos;ll show you how)</span>
          </div>
          <div className="si-check-row">
            <span className="si-check-box" />
            <span className="si-check-text">Re-upload to your site</span>
          </div>
          <div className="si-check-row">
            <span className="si-check-box" />
            <span className="si-check-text">Re-test and confirm fix</span>
          </div>
        </div>
        <div className="si-guide-foot">
          <div className="si-guide-progress">
            <div className="si-guide-bar"><div className="si-guide-bar-fill" style={{ width: "25%" }} /></div>
            <span className="si-guide-progress-label">Step 2 of 4</span>
          </div>
          <span className="si-guide-next">Show me how →</span>
        </div>
      </div>
      <div className="si-tag si-tag-bl">
        <span className="si-tag-dot si-tag-dot-acc" />
        Fix walkthrough
      </div>
    </div>
  );
}

export function PaidMediaScanImage() {
  return (
    <div className="si-frame">
      <div className="si-browser">
        <div className="si-chrome">
          <span className="si-dot si-dot-r" />
          <span className="si-dot si-dot-y" />
          <span className="si-dot si-dot-g" />
          <div className="si-urlbar">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <span>search · plumber near Bath</span>
          </div>
        </div>
        <div className="si-body si-ads-body">
          <div className="si-ads-query">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <span>plumber near Bath</span>
            <span className="si-ads-query-tail">About 2.1M results</span>
          </div>
          <div className="si-ads-list">
            <div className="si-ad si-ad-hi">
              <div className="si-ad-top">
                <span className="si-ad-pill">Ad</span>
                <span className="si-ad-url">oakhillplumbing.co.uk › emergency</span>
              </div>
              <div className="si-ad-title">24/7 Emergency Plumber Bath — From £49</div>
              <div className="si-ad-desc">Local, Gas Safe registered plumbers. 60-minute response, no call-out fee on weekdays. Book in 2 minutes.</div>
              <div className="si-ad-ext">
                <span>Book now</span><span>Pricing</span><span>Reviews</span>
              </div>
            </div>
            <div className="si-ad">
              <div className="si-ad-top">
                <span className="si-ad-pill">Ad</span>
                <span className="si-ad-url">riversideplumbers.co.uk</span>
              </div>
              <div className="si-ad-title">Boiler &amp; Heating Specialists in Bath</div>
              <div className="si-ad-desc">Same-day callouts. Free no-obligation quotes for new boilers and repairs.</div>
            </div>
            <div className="si-ads-divider"><span>Organic results</span></div>
            <div className="si-organic">
              <div className="si-organic-url">bathdrainco.co.uk</div>
              <div className="si-organic-title">Bath Drain Co. — Drainage &amp; plumbing services</div>
            </div>
            <div className="si-organic">
              <div className="si-organic-url">yoursite.co.uk</div>
              <div className="si-organic-title">Your business — Local plumbing in Bath</div>
            </div>
          </div>
        </div>
      </div>
      <div className="si-tag si-tag-tr">
        <span className="si-tag-dot si-tag-dot-acc" />
        2 new ads
      </div>
    </div>
  );
}

export function PaidMediaEmailImage() {
  return (
    <div className="si-frame">
      <div className="si-inbox">
        <div className="si-inbox-head">
          <div className="si-inbox-tab is-on">Inbox <span className="si-pill">2</span></div>
          <div className="si-inbox-tab">Starred</div>
          <div className="si-inbox-tab">Sent</div>
        </div>
        <div className="si-mail si-mail-unread">
          <div className="si-mail-avatar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" />
            </svg>
          </div>
          <div className="si-mail-body">
            <div className="si-mail-row">
              <span className="si-mail-from">BadgerAlerts</span>
              <span className="si-mail-time">7:48 AM</span>
            </div>
            <div className="si-mail-subject">2 competitors are running ads you&apos;re not</div>
            <div className="si-mail-preview">Oak Hill Plumbing and Riverside are bidding on &quot;emergency plumber Bath&quot; — here&apos;s what they&apos;re spending and how to compete on a smaller budget…</div>
            <div className="si-mail-chips">
              <span className="si-chip si-chip-acc">Paid media</span>
              <span className="si-chip">Competitor</span>
              <span className="si-chip">Opportunity</span>
            </div>
          </div>
          <span className="si-unread-dot" />
        </div>
        <div className="si-mail">
          <div className="si-mail-avatar si-avatar-flat" style={{ background: "#FEF3E2", color: "#854F0B" }}>WS</div>
          <div className="si-mail-body">
            <div className="si-mail-row">
              <span className="si-mail-from si-from-dim">Weekly summary</span>
              <span className="si-mail-time si-from-dim">Yesterday</span>
            </div>
            <div className="si-mail-subject si-subject-dim">Your week at a glance — 4 alerts, 2 wins</div>
          </div>
        </div>
        <div className="si-mail">
          <div className="si-mail-avatar si-avatar-flat" style={{ background: "#EBF3FE", color: "#1F4FA8" }}>RR</div>
          <div className="si-mail-body">
            <div className="si-mail-row">
              <span className="si-mail-from si-from-dim">Ranking report</span>
              <span className="si-mail-time si-from-dim">2 days ago</span>
            </div>
            <div className="si-mail-subject si-subject-dim">You moved up 3 places for &quot;emergency plumber Bath&quot;</div>
          </div>
        </div>
      </div>
      <div className="si-tag si-tag-tr">
        <span className="si-tag-dot si-tag-dot-acc" />
        New alert
      </div>
    </div>
  );
}

export function PaidMediaDashboardImage() {
  return (
    <div className="si-frame">
      <div className="si-guide">
        <div className="si-pm-head">
          <span className="si-pm-eyebrow">Suggested campaign</span>
          <span className="si-pm-budget"><strong>£12</strong>/day</span>
        </div>
        <div className="si-pm-title">Local emergency callouts</div>
        <div className="si-pm-sub">Google Search · Bath, 8mi radius</div>
        <div className="si-pm-card">
          <div className="si-pm-card-head">
            <span className="si-pm-card-title">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Keywords
            </span>
            <span className="si-pm-card-meta">8 suggested</span>
          </div>
          <div className="si-pm-keywords">
            <span className="si-pm-kw si-pm-kw-acc">emergency plumber bath</span>
            <span className="si-pm-kw">plumber near me</span>
            <span className="si-pm-kw">boiler repair bath</span>
            <span className="si-pm-kw">24 hour plumber</span>
            <span className="si-pm-kw">+4 more</span>
          </div>
        </div>
        <div className="si-pm-card">
          <div className="si-pm-card-head">
            <span className="si-pm-card-title">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" />
                <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5M14 20c0-2 1.5-4 4-4s4 1.5 4 4" />
              </svg>
              Audience match
            </span>
            <span className="si-pm-card-meta">~14k people</span>
          </div>
          <div className="si-pm-audience">
            <div className="si-pm-audience-bar"><span style={{ width: "78%" }} /></div>
            <span className="si-pm-audience-label">78% intent</span>
          </div>
        </div>
        <div className="si-pm-projection">
          <div className="si-pm-proj-cell">
            <div className="si-pm-proj-label">Clicks</div>
            <div className="si-pm-proj-value">42<span className="si-stat-unit">/wk</span></div>
          </div>
          <div className="si-pm-proj-cell">
            <div className="si-pm-proj-label">CPC</div>
            <div className="si-pm-proj-value">£1.90</div>
          </div>
          <div className="si-pm-proj-cell">
            <div className="si-pm-proj-label">Est. leads</div>
            <div className="si-pm-proj-value si-pm-proj-value-acc">6–9</div>
          </div>
        </div>
        <div className="si-guide-foot">
          <div className="si-guide-progress">
            <div className="si-guide-bar"><div className="si-guide-bar-fill" style={{ width: "50%" }} /></div>
            <span className="si-guide-progress-label">Step 2 of 4</span>
          </div>
          <span className="si-guide-next">Help me launch →</span>
        </div>
      </div>
      <div className="si-tag si-tag-bl">
        <span className="si-tag-dot si-tag-dot-acc" />
        Ready to launch
      </div>
    </div>
  );
}

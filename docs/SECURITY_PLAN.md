# NIXFRED GALAXY Security Plan

Status: Draft for implementation. Applies to `galaxy.nixfred.com`, the public repository `nixfred/galaxy.nixfred.com`, and its GitHub Actions plus Cloudflare Pages delivery pipeline.

This plan scales the threat model honestly to what the product actually is: a fully static Astro site with a lazy loaded Three.js scene, no server runtime, no database, no user accounts, no forms, no cookies, and no personal data collection. Cloudflare Web Analytics is the only third party script. Because there is no login, session, or stored user data, the classic dynamic application risks (SQL injection, authentication bypass, CSRF, session hijacking, server side request forgery) do not apply. The assets actually worth protecting are three:

1. The Cloudflare API token that can deploy to production. If stolen it allows defacement.
2. The integrity of the source repository and its build pipeline. A compromise here reaches every visitor.
3. Visitor trust in the browser. Any script injection or unsafe external navigation damages the people the site is meant to impress.

Every control below is justified against those three assets. Nothing here is security theater added for its own sake.

---

## 1. Threat model

Likelihood and impact are rated for this specific static portfolio, not for a generic web application.

| # | Threat | Likelihood | Impact | Primary mitigations |
|---|--------|-----------|--------|---------------------|
| T1 | Supply chain compromise of a Bun or npm dependency that ends up in the shipped bundle or runs at build time | Medium | High | Committed `bun.lock`, frozen install (`--frozen-lockfile`), small dependency surface, Dependabot weekly grouped updates, `bun audit` gate on critical and high, CodeQL, human review of every Dependabot diff, disable install scripts for untrusted packages |
| T2 | Supply chain compromise of a third party GitHub Action (a tag repointed to malicious code) | Medium | High | Pin every third party action to a full length immutable commit SHA, least privilege `GITHUB_TOKEN`, Cloudflare secrets exposed only to trusted deploy jobs, Dependabot updates for actions, workflow review gate |
| T3 | Credential leakage through a committed file or a CI log | Medium | High | GitHub secret scanning with push protection, gitleaks pre commit hook and CI history scan, never echo secrets, GitHub masks environment secrets, Cloudflare token scoped to Pages only, documented rotation runbook |
| T4 | Malicious pull request that tries to read secrets or deploy from untrusted code | Low to Medium | High | Build and test on the `pull_request` event only (never `pull_request_target`), no secrets are available to fork or Dependabot pull requests by GitHub design, deploy jobs gated to same repository branches, production requires the protected environment |
| T5 | Defacement or redirect through a compromised Cloudflare API token | Low | High | Token limited to the minimum Pages permissions, stored in the GitHub `production` environment, rotation runbook, Cloudflare account two factor authentication, deployment records plus a tested rollback path, Cloudflare audit log |
| T6 | Cross site scripting through data file content rendered into the DOM | Low | Medium | Astro auto escaping for all data values, a hard ban on `set:html` and `innerHTML` with data derived content, URL scheme validation in the data schema, optional markdown sanitization, Content Security Policy as defense in depth so an injected inline script still cannot execute |
| T7 | Typosquatting of a dependency or action name | Low to Medium | High | Exact version and SHA pinning, review of every added dependency and its publisher, minimal dependency surface, Dependabot diffs read before merge |
| T8 | Subdomain or DNS takeover of `galaxy.nixfred.com` if the Pages project is deleted while the DNS record remains | Low | Medium | Keep the Pages project and the DNS record lifecycle in sync, the scheduled checks workflow verifies the custom domain still serves the expected build |
| T9 | Private data from the maintainer environment bleeding into the public repository | Low to Medium | High | The catalog snapshot is produced only from the public `portfolio.json`, `.gitignore` blocks local secret files, secret scanning and gitleaks run on history, every staged change is reviewed for private data before commit |
| T10 | Clickjacking or embedding the site in a hostile frame | Low | Low | `frame-ancestors 'none'` in CSP plus `X-Frame-Options: DENY`. There are no sensitive actions to hijack, so this is low impact hardening |

Honest note on scale. T1, T2, T3, and T5 are the threats that matter for this project because they can reach every visitor or take over the live site. T6, T9, and T10 are lower because there is no authentication, no cookie, and no stored user data to steal, and because all data is authored by Fred or imported from a public source under review. The plan invests accordingly.

---

## 2. Security headers for `public/_headers`

Cloudflare Pages serves headers from `public/_headers`. Each header is a single line and cannot wrap. The block below is a concrete starting point that works with Astro static output, external (non inline) scripts, self hosted fonts and textures, a WebGL canvas, and Cloudflare Web Analytics.

```
/*
  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; manifest-src 'self'; media-src 'self'; worker-src 'self' blob:; frame-src 'none'; upgrade-insecure-requests
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), usb=(), interest-cohort=()
  X-Frame-Options: DENY
  Cross-Origin-Opener-Policy: same-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/build.json
  Cache-Control: public, max-age=0, must-revalidate

/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

### Directive by directive

Content Security Policy directives:

- `default-src 'self'`. The fallback. Anything not named more specifically is restricted to the site origin.
- `base-uri 'self'`. Blocks an injected `<base>` tag from repointing every relative URL to a hostile origin.
- `object-src 'none'`. No plugins, Flash, or embedded objects. There is no legitimate use here.
- `frame-ancestors 'none'`. The site cannot be embedded in any frame. Clickjacking protection. This is the modern replacement for `X-Frame-Options`, kept alongside it for older browsers.
- `form-action 'self'`. There are no forms, so this restricts any injected form from submitting off origin.
- `script-src 'self' https://static.cloudflareinsights.com`. Own bundled scripts plus the Cloudflare Web Analytics beacon, which is loaded as an external `defer` script and needs no inline allowance. BUILD REALITY: Astro normally bundles processed `<script>` tags into external files under `/_astro/`, which `'self'` covers. If the actual build emits any inline hydration bootstrap (possible with certain client directives or `is:inline`), do not add `'unsafe-inline'`. Instead adopt Astro's experimental CSP hashing, which computes per script hashes at build time and injects them, or refactor the offending script to an external file. Verify against the real `dist` output before launch.
- `style-src 'self' 'unsafe-inline'`. External stylesheets from the origin, plus inline style attributes. BUILD REALITY: `'unsafe-inline'` is present because Astro scoped styles and Three.js frequently set inline `style` attributes on elements and the canvas, which are impractical to eliminate on a static host with no per request nonce. Style injection is far lower risk than script injection because styles cannot execute code. Tighten toward a hash based `style-src` if the build proves it is feasible. This is the second directive most likely to need adjustment.
- `img-src 'self' data: blob:`. Local thumbnails and Open Graph images from the origin, `data:` for small inlined SVG and icons, and `blob:` for canvas generated sector glyphs and textures used when a thumbnail is missing. Images cannot execute, so `data:` and `blob:` here are low risk.
- `font-src 'self'`. Fonts are self hosted (Space Grotesk and JetBrains Mono). No external font CDN is permitted.
- `connect-src 'self' https://cloudflareinsights.com`. Same origin fetches for the generated graph data and `build.json`, plus the Cloudflare Web Analytics RUM beacon endpoint at `cloudflareinsights.com/cdn-cgi/rum`.
- `manifest-src 'self'`. The web app manifest is same origin.
- `media-src 'self'`. Optional ambient audio, if enabled, is served from the origin only.
- `worker-src 'self' blob:`. Covers any bundler generated web worker. `blob:` is required because bundlers commonly instantiate workers from a blob URL. Remove `blob:` if no worker is used.
- `frame-src 'none'`. The site embeds no iframes.
- `upgrade-insecure-requests`. Any subresource requested over HTTP is upgraded to HTTPS, reinforcing the HTTPS only rule for external links.

Other headers:

- `X-Content-Type-Options: nosniff`. Stops the browser from guessing a content type and executing a mislabeled asset. Required by SR005.
- `Referrer-Policy: strict-origin-when-cross-origin`. Sends the full referrer within the origin, only the origin across origins, and nothing when downgrading to HTTP. Balances analytics usefulness with privacy. Required by SR005.
- `Permissions-Policy`. Disables every powerful browser feature the site does not use. `autoplay=()` reinforces the no audio autoplay rule. `interest-cohort=()` opts out of cohort based tracking. `fullscreen=(self)` is allowed only in case a fullscreen map toggle exists; set it to `()` if fullscreen is never used. Required by SR005.
- `X-Frame-Options: DENY`. Legacy clickjacking protection paired with `frame-ancestors`.
- `Cross-Origin-Opener-Policy: same-origin`. Isolates the browsing context so a window opened by the site cannot reach back into it. Safe here and recommended hardening. Do NOT add `Cross-Origin-Embedder-Policy: require-corp`, because it would break the Cloudflare beacon and any cross origin resource that does not send a CORP header.
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`. Forces HTTPS for a year for this host and any deeper subdomain. PENDING FRED: `preload` is deliberately omitted because preload is a zone level commitment for the whole `nixfred.com` apex and must not be asserted from a single subdomain. Confirm whether HSTS is better managed centrally at the Cloudflare zone level, in which case this line can be removed here.

Caching rationale. HTML and `build.json` receive `max-age=0, must-revalidate` so a new release and its build metadata appear immediately. Fingerprinted `/_astro/` assets receive one year immutable caching because their filenames change on every content change. None of the caching rules weaken security.

Preview non indexation. The CI/CD contract requires preview deployments to be non indexable. `_headers` applies to all deployments including production, so it is the wrong place for a blanket `noindex`. Handle this at build time instead: inject `<meta name="robots" content="noindex">` (and optionally an `X-Robots-Tag` on the `*.pages.dev` host) only when the build is not the production build. This is a build configuration item for the DevOps workstream, cross referenced here so it is not lost.

---

## 3. CI/CD security design

### 3.1 Least privilege `GITHUB_TOKEN`

Set a restrictive top level `permissions` block in every workflow and widen only the specific job that needs more. The default token should be read only.

| Workflow | Recommended permissions | Reason |
|----------|------------------------|--------|
| `ci.yml` | `contents: read` | Checkout and build only. Artifacts upload needs no token scope. |
| `preview.yml` | `contents: read`, `pull-requests: write`, `deployments: write`, `statuses: write` | Comment the preview URL on the pull request and record the deployment. |
| `production.yml` | `contents: write`, `deployments: write` | Create the release tag or record and the deployment. |
| `rollback.yml` | `contents: read`, `deployments: write` | Restore a prior deployment and record it. |
| `scheduled_checks.yml` | `contents: read`, `issues: write` | Open an issue only when an actionable failure threshold is met. |
| `security.yml` (CodeQL) | `contents: read`, `security-events: write`, `actions: read` | Upload CodeQL results to the security tab. |

### 3.2 Secret scoping to production jobs

The only protected values are `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Store them in a GitHub `production` environment, not as plain repository secrets, so environment protection rules govern their use. Non secret values (Pages project name, production branch, custom domain, the public Cloudflare Web Analytics token) live in repository variables. The Cloudflare Web Analytics site token is public by design and belongs in a variable, never a secret.

Only the jobs that actually deploy may reference the Cloudflare secrets: the preview deploy job (restricted to same repository branches), the production deploy job, and the rollback job. The `ci.yml`, `security.yml`, and `scheduled_checks.yml` workflows never reference deployment secrets.

### 3.3 Fork and untrusted pull request safety

- Build and test the proposed code using the `pull_request` event only. Never use `pull_request_target` to build or execute untrusted code, because that event runs with the base repository context and secret access.
- GitHub does not expose secrets or a writable token to workflows triggered by fork pull requests or by Dependabot. This is the correct behavior and it means fork and Dependabot pull requests receive CI (format, lint, type check, data validation, unit and browser tests, build) but do not receive a Cloudflare preview deploy. Document this so a missing preview on a fork PR is understood as designed, not broken.
- Guard the preview deploy job so it runs only for same repository branches, for example a job level condition `github.event.pull_request.head.repo.full_name == github.repository`.
- Production deployment runs on push to `main` (a trusted event) and references the protected `production` environment.

### 3.4 Action pinning policy

- Pin every third party action to a full 40 character commit SHA, with a trailing comment naming the intended release, for example `uses: cloudflare/wrangler-action@<40 char sha> # v3.x`. This satisfies SR009 and AC044.
- Extend the same SHA pinning to first party `actions/*` actions. It is the same one line change and removes any dependence on mutable tags.
- Dependabot updates action SHAs weekly (see section 5). Every bump is reviewed before merge.
- Add a lightweight CI lint step that fails if any workflow references an action by a mutable tag (a `@v` or `@main` style reference) rather than a SHA, so a future edit cannot silently reintroduce an unpinned action.

### 3.5 Static analysis with CodeQL

Add a `security.yml` workflow running CodeQL for JavaScript and TypeScript on pushes to `main`, on pull requests, and on a weekly schedule. The public repository gets CodeQL at no cost. It covers both the application source and the build and sync scripts. Results appear in the repository security tab. This is the equivalent static analysis called for by the CI/CD contract.

### 3.6 Dependency audit gate

- Run a dependency audit in `ci.yml` that fails the build on any critical or high severity advisory. Use `bun audit --audit-level=high` if the pinned Bun version supports it reliably, otherwise run OSV Scanner as a SHA pinned action against the lockfile. This satisfies SR008.
- Exception path. If a critical or high finding has no available fix and the affected code path is not reachable in a static site, a temporary, dated exception may be recorded in `docs/DECISIONS.md`. Each exception entry must contain the advisory identifier, the affected package and version, the reason the risk is acceptable for this project, the mitigating factor, and a review date. The audit step reads the exception list so an approved advisory does not block the build, and any advisory not on the list still fails. No exception is open ended.

### 3.7 Build and deploy separation

Keep validation, preview, production, and rollback in separate workflows so permissions and failure behavior stay legible. The exact artifact that passed `ci.yml` is the artifact deployed, and production verification confirms the live `build.json` commit matches the deployed commit. The build output is scanned to confirm it contains no secrets, no local filesystem paths, and no private URLs before it is treated as releasable.

---

## 4. Public repository hygiene

### 4.1 Secret scanning, layered

- Enable GitHub secret scanning with push protection on the repository. For a public repo this is free and blocks a secret from being pushed in the first place.
- Add gitleaks as a pre commit hook so a secret is caught locally before it ever leaves the machine, and as a CI job (a SHA pinned gitleaks action) that scans the full history and the pull request diff. A finding fails the build.
- The two layers are complementary: push protection catches known provider token formats at push time, gitleaks catches broader patterns and scans history.

### 4.2 What may never be committed

- `CLOUDFLARE_API_TOKEN` and any Cloudflare or GitHub credential.
- `CLOUDFLARE_ACCOUNT_ID`. Lower sensitivity than the token, but it is an identifier that belongs in a protected variable, not in source.
- Any `.env`, `.env.*`, `.dev.vars`, or Wrangler local credential file. `.gitignore` must list `.env*`, `.dev.vars`, `.wrangler/`, `node_modules/`, and `dist/`.
- Private portfolio data. The catalog snapshot is produced only from the public `portfolio.json` by the sync script, never hand assembled from private sources. This enforces SR002.
- Any private, employer, client, or family data beyond the public landing page and public description of a project.

### 4.3 Source map policy

Recommendation: do not deploy source maps to production. Because the repository is public and MIT licensed, the source is not confidential, so the goal is not to hide logic. The concrete reason to omit production source maps is twofold: source maps commonly embed absolute local filesystem paths, which is a minor information leak of the build environment, and they add transfer weight that competes with the performance budgets. Configure the production build with `sourcemap: false` or `sourcemap: 'hidden'`, and if maps are generated for debugging, retain them as a CI artifact rather than uploading them to the deployed site. This also keeps the build output free of local paths as the artifact integrity rule requires.

---

## 5. Dependency and data handling

### 5.1 Dependency updates

Dependabot runs weekly with grouped updates for Bun packages and for GitHub Actions, matching the settled ruling. Grouping reduces pull request noise. Every group is reviewed before merge, and each still passes the full CI gate including the audit step and CodeQL.

### 5.2 Escaping rules for data rendered into the DOM

The catalog fields come from the upstream public `portfolio.json`, and enrichment, relationship, sector, and tour data are authored by Fred and reviewed through pull requests. Both are treated as data, never as markup. SR007 forbids raw untrusted HTML from data files, enforced as follows:

- Render every data string through Astro expression syntax `{value}`, which auto escapes. This is the default and correct path.
- Never pass data derived content to `set:html`, `innerHTML`, `outerHTML`, or any equivalent. Add an ESLint rule that flags `set:html` and direct `innerHTML` assignment so a future contributor cannot reintroduce the risk.
- Long description markdown, if rendered through Astro content collections, is authored only by Fred in the repository under review. As defense in depth, either disable raw HTML in that markdown or run a `rehype-sanitize` pass, so even a mistaken paste of raw HTML cannot inject script.
- Validate every URL field at build time in the Zod schema. Accept only `https:` external URLs and internal relative paths. Reject `javascript:`, `data:`, and non HTTPS schemes outright. A bad URL fails CI rather than reaching a visitor, which supports both SR003 and DR008.

### 5.3 External link policy

- All external project links are HTTPS only, enforced by the schema validator and the `check-links` script (SR003).
- Every link that opens a new tab uses `target="_blank"` with `rel="noopener noreferrer"`. `noopener` severs the `window.opener` reference so the destination cannot manipulate the origin tab, and `noreferrer` avoids leaking the referrer. This is the safe link attribute behavior required by FR022.

---

## 6. Traceability

Each security and privacy requirement and each security acceptance criterion is mapped to the concrete mechanism that enforces it.

| Requirement | Enforcing mechanism |
|-------------|---------------------|
| SR001 No secrets in client code | Secrets held only in the GitHub `production` environment and used only by deploy jobs. No secret is referenced in `src/` or `public/`. Only the public Cloudflare Web Analytics token appears client side. Verified by gitleaks, secret scanning, and the build output secret scan (AC040). |
| SR002 No private catalog data committed | Snapshot produced only from public `portfolio.json` by the sync script, schema validated, reviewed in pull requests, and scanned by gitleaks. `.gitignore` blocks local secret files. |
| SR003 External links HTTPS | Zod URL validation rejecting non HTTPS and dangerous schemes at build time, plus the `check-links` script and the `rel`/`target` attributes. |
| SR004 Restrictive CSP compatible with local assets and Cloudflare Web Analytics | The `Content-Security-Policy` in `public/_headers`, with `script-src` allowing `static.cloudflareinsights.com` and `connect-src` allowing `cloudflareinsights.com`, everything else same origin. |
| SR005 `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` via `public/_headers` | Those three headers are present in the `_headers` block in section 2. |
| SR006 No third party ad, replay, fingerprinting, chat, or marketing scripts | The CSP `script-src` and `connect-src` allowlists block any origin other than self and Cloudflare Web Analytics. Verified by the network allowlist test (AC042) and code review. |
| SR007 No raw untrusted HTML from data files | Astro auto escaping, a ban on `set:html` and `innerHTML` with data, optional `rehype-sanitize`, and an ESLint rule. |
| SR008 Dependency scanning blocks critical and high unless a documented exception exists | The `bun audit` or OSV Scanner gate in `ci.yml`, with the dated exception list in `docs/DECISIONS.md`. |
| SR009 Third party actions pinned to immutable SHAs | The SHA pinning policy, the mutable tag lint step, and Dependabot action updates (AC044). |
| SR010 `SECURITY.md` with a responsible reporting path | The `SECURITY.md` deliverable at the repository root. |
| AC040 No credentials in Git history, build output, browser source, or logs | gitleaks history scan, secret scanning with push protection, the build output secret scan step, the never echo policy with GitHub secret masking, and the source map policy that keeps local paths out of the output. |
| AC041 Security headers appear on the custom domain | The `_headers` file plus a Playwright `security-headers` smoke test that asserts the headers on `https://galaxy.nixfred.com` in the production verification job. |
| AC042 No unapproved third party scripts load | The CSP `script-src` allowlist plus a Playwright network allowlist test that fails if any request goes to an origin other than self or Cloudflare Web Analytics. |
| AC043 Cloudflare Web Analytics is the only analytics system | The CSP `connect-src` allowlist, a network trace test, and source review confirming no other analytics library is imported. |
| AC044 Third party actions pinned to immutable commits | Workflow review, the mutable tag lint step, and Dependabot. |

---

## 7. Open items requiring Fred's decision

- PENDING FRED: preferred security contact email for `SECURITY.md`, in addition to the GitHub private vulnerability reporting path.
- PENDING FRED: whether `Strict-Transport-Security` should carry `includeSubDomains` at the `galaxy.nixfred.com` host level or be managed centrally at the Cloudflare zone for `nixfred.com`, and whether the apex is ever to be HSTS preloaded. The plan omits `preload` from the subdomain until this is settled.
- OPTIONAL: a CSP violation reporting endpoint (`report-to`). Cloudflare does not provide a free collector by default, so this is left off unless Fred wants report collection wired to an external service.

# Security Policy

## Supported versions

NIXFRED GALAXY is a continuously deployed static site. Only the current production deployment at `https://galaxy.nixfred.com` is supported. There are no older released versions to patch.

## Reporting a vulnerability

Please report security issues privately. Do not open a public issue for a suspected vulnerability.

- Preferred: use GitHub private vulnerability reporting for this repository. Go to the repository Security tab, then Report a vulnerability. This opens a private advisory visible only to the maintainer.
- Alternative contact: email `frednix@gmail.com` with a subject line beginning `SECURITY: galaxy.nixfred.com`.

Please include the affected URL or page, a description of the issue, clear reproduction steps, and the potential impact. A proof of concept is welcome when it can be shared safely. Please do not run automated scanning that degrades the site for other visitors, and please do not attempt denial of service.

## Response expectations

This is a personal portfolio project maintained by one person, so responses are best effort rather than contractual.

- Acknowledgement of a valid report: within about five business days.
- Initial assessment and severity: within about ten business days.
- Fix or documented mitigation for a confirmed high severity issue: as promptly as the maintainer can manage, prioritized ahead of feature work.

We will keep you updated as an issue is triaged and resolved, and we are happy to credit reporters who want acknowledgement once a fix is live.

## Scope

In scope:

- The static site served at `https://galaxy.nixfred.com`.
- The public source repository `nixfred/galaxy.nixfred.com`, including its GitHub Actions workflows and Cloudflare Pages delivery configuration.

Out of scope:

- Third party services the site links to or depends on, including GitHub, Cloudflare, and any external project destination. Report issues in those services to their own security teams.
- The Cloudflare Web Analytics service itself.
- Findings that require a compromised end user device or browser, physical access, or social engineering of the maintainer.
- Volumetric denial of service and automated load testing.
- Reports of missing headers or configuration that have no demonstrable security impact on this static, cookieless site.

## Privacy statement

NIXFRED GALAXY is designed to collect as little as possible.

- No cookies are set, so no cookie consent banner is required.
- No accounts, logins, forms, or personal data collection.
- The only analytics is Cloudflare Web Analytics, which is privacy focused, does not use cookies, and does not fingerprint visitors.
- No third party advertising, session replay, fingerprinting, chat, or marketing scripts are loaded.
- Any project pinning, search, or navigation stays in the browser for the current session and is never transmitted as personally identifiable data.

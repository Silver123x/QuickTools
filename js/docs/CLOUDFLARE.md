# Cloudflare Pages & CDN Integration

## Requirements
- Cloudflare account with Pages enabled
- Domain managed by Cloudflare (DNS on Cloudflare)
- API Token with permissions for Cache Purge and Pages deployments

## Deploy Static Site
1. Create a new Cloudflare Pages project and connect your GitHub repository
2. Set Build command: none (static), Output directory: `/`
3. For branches, select `main` for production

## CDN Settings
- Enable Smart Routing and Argo (optional for latency improvements)
- Set Caching:
  - Cache Everything for static assets
  - Respect cache-control headers
- Configure Edge TTL and Browser TTL to suitable values (e.g., 1 day edge, 1 hour browser)

## Security Headers (at Edge)
- Use `_headers` file at project root to define edge headers:
```
/* 
  Content-Security-Policy: default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://api.exchangerate.host; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## Cache Purge Automation
- Use the provided script to purge cache after deployments
- Set environment variables:
  - `CF_API_TOKEN` – API Token
  - `CF_ZONE_ID` – your zone ID
```
node scripts/cf-purge.js
```

## Environment Configurations
- Use `configs/env.production.json` and `configs/env.preview.json` to store non-secret defaults
- Never commit secrets; use Cloudflare environment variables and Pages project settings

## Rollback Procedures
1. Re-deploy previous commit from GitHub (Pages will redeploy)
2. Purge cache via API to ensure users receive previous assets
3. Verify site integrity with Lighthouse and Web Vitals

## Performance Monitoring
- Enable Cloudflare Analytics
- Use Web Vitals collection in `js/core/app.js` and wire to your analytics backend
- Review Core Web Vitals in PageSpeed Insights regularly

## Troubleshooting
- Headers not applied: ensure `_headers` exists at root of the deployed output
- CSP violations: check console for blocked resources; adjust CSP policies
- Cache not purging: verify token scopes include `Zone.Cache Purge`

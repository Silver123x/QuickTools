# Tools Wonder Upgrades

## Performance Optimization
- Code splitting and lazy loading via dynamic imports for tools
- PWA with service worker caching and offline fallback
- Image previews use `loading="lazy"` and responsive CSS
- Security headers (CSP, Referrer-Policy) added via meta tags for static hosting

## Feature Enhancements
- Modern, accessible components; WCAG-conscious focus and contrast
- Dark mode toggle with design tokens and local preference
- Lightweight web vitals collection with analytics hook (`window.TW_ANALYTICS`)
- CDN guidance: front GitHub Pages with Cloudflare for global distribution

## Technical Improvements
- CI/CD: GitHub Actions workflow for Pages deployment
- Dependabot for automated GitHub Actions updates
- Service worker for offline; manifest for installable PWA

## User Experience
- Responsive refinements and accessible skip link
- Improved form validation and focus outline consistency
- Navigation retains mobile hamburger and keyboard support

## Maintenance
- This document records upgrade decisions and implementations
- See CHANGELOG.md for versioned changes

## Notes
- TypeScript migration plan: introduce tsconfig and compile in CI in a future iteration
- Analytics: plug in GA4/Plausible by assigning `window.TW_ANALYTICS` handler
- Security headers: for stronger enforcement, configure headers via CDN or custom host

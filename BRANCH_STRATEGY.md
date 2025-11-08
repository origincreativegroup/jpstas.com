# Branch Strategy

## Branches

- `main` - Production branch (deploys to Cloudflare Pages)
- `develop` - Development branch (deploys to pi-forge local server)

## Deployment Workflows

### Production (main → Cloudflare Pages)
- Workflow: `.github/workflows/deploy.yml`
- Trigger: Push to `main` branch
- Target: Cloudflare Pages + Fly.io backend
- URL: https://jpstas-portfolio.pages.dev

### Local Development (develop → pi-forge)
- Workflow: `.github/workflows/deploy-pi-forge.yml`
- Trigger: Push to `develop` branch
- Target: Pi-forge self-hosted server
- URL: http://192.168.50.157:8000

## Workflow

1. Make changes and commit to `develop` branch
2. Test on pi-forge local deployment
3. When ready for production, merge `develop` → `main`
4. Production automatically deploys to Cloudflare Pages


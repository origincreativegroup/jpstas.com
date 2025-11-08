# Pi-Forge Deployment Documentation

## Overview

This document describes the automated deployment setup for jpstas.com on the pi-forge server (192.168.50.157:8000). The site is deployed via GitHub Actions using a self-hosted runner and served through an nginx Docker container.

## Architecture

### Infrastructure

- **Server**: pi-forge (192.168.50.157)
- **Container**: nginx-sites (nginx:alpine)
- **Network**: Docker bridge network (172.19.0.0/16)
- **Port**: 8000 (mapped to container port 80)
- **Deployment Path**: `/home/admin/deployments/jpstas.com/current/`
- **Volume Mount**: `/home/admin/deployments` → `/var/www` (in container)

### Docker Container Setup

The nginx-sites container is managed via docker-compose:

```yaml
# Location: /home/admin/docker/nginx-sites/docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    container_name: nginx-sites
    restart: unless-stopped
    ports:
      - "8000:80"
      - "8443:443"
    volumes:
      - ./conf.d:/etc/nginx/conf.d
      - /home/admin/deployments:/var/www
      - ./ssl:/etc/nginx/ssl
    networks:
      - web
```

### Nginx Configuration

Site configuration at `/home/admin/docker/nginx-sites/conf.d/jpstas.com.conf`:

```nginx
server {
    listen 80;
    server_name jpstas.local localhost;

    root /var/www/jpstas.com/current;
    index index.html;

    # Logging
    access_log /var/log/nginx/jpstas_access.log;
    error_log /var/log/nginx/jpstas_error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Single Page Application - try files then fallback to index.html
    location / {
        try_files $uri $uri/index.html $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

## GitHub Actions Workflow

### Workflow Configuration

File: `.github/workflows/deploy-pi-forge.yml`

**Trigger**: Push to `develop` branch

**Runner**: Self-hosted runner on pi-forge
- Name: `pi-forge`
- Labels: `self-hosted`, `Linux`, `ARM64`, `pi-forge`
- Runs as: root user in Docker container

### Deployment Steps

1. **Checkout**: Clone repository code
2. **Setup Node.js**: Install Node.js 20
3. **Install Dependencies**: Run `npm ci`
4. **Build**: Run `npm run build.client` (client-only build)
5. **Sync Files**: Rsync dist/ to deployment directory
6. **Reload Container**: Restart nginx-sites container
7. **Health Check**: Verify site is accessible

### Key Configuration Details

#### Self-Hosted Runner

The workflow uses a self-hosted runner that runs as root in a Docker container on pi-forge:

```yaml
runs-on: self-hosted
```

#### Deployment Paths

Since the runner runs as root, absolute paths are required:

```yaml
- name: Sync to deployment directory
  run: |
    mkdir -p /home/admin/deployments/jpstas.com/current
    rsync -av --delete dist/ /home/admin/deployments/jpstas.com/current/
```

#### Container Restart

Using `docker restart` instead of `docker compose` to avoid directory permission issues:

```yaml
- name: Reload nginx Docker container
  run: docker restart nginx-sites
```

#### Health Check

Uses the host IP instead of localhost (since runner is in a container):

```yaml
- name: Health check
  run: curl -fsSL http://192.168.50.157:8000/health
```

## GitHub Secrets

The following secrets are configured (though not currently used with self-hosted runner):

- `PI_FORGE_SSH_KEY`: SSH private key for remote deployment (for ubuntu-latest runner alternative)

Location: SSH key at `~/.ssh/github_actions_pi_forge` (local), public key added to admin@192.168.50.157

## Deployment Process

### Automatic Deployment

1. Push changes to the `develop` branch
2. GitHub Actions automatically triggers the workflow
3. Self-hosted runner on pi-forge builds the site
4. Built files are synced to `/home/admin/deployments/jpstas.com/current/`
5. Nginx container is restarted to pick up changes
6. Health check verifies deployment success
7. Site is live at http://192.168.50.157:8000

### Manual Deployment

To manually deploy:

```bash
# SSH into pi-forge
ssh admin@192.168.50.157

# Navigate to deployment directory
cd ~/deployments/jpstas.com/current

# Pull/copy new files to this directory

# Restart nginx container
docker restart nginx-sites

# Verify
curl http://localhost:8000/health
```

## Troubleshooting

### Common Issues

**Container not accessible from runner:**
- Symptom: Health check fails with "Connection refused"
- Cause: GitHub runner is in Docker container, localhost doesn't reach nginx-sites
- Solution: Use host IP (192.168.50.157) instead of localhost

**Permission denied errors:**
- Symptom: Cannot access `/home/admin/docker/nginx-sites/`
- Cause: Directory has 700 permissions, runner as root can't access admin's private dirs
- Solution: Use `docker restart` instead of `cd` + `docker compose`

**Deployment files not updating:**
- Symptom: Old content still served after deployment
- Cause: Container not restarted or wrong deployment path
- Solution: Verify rsync target and ensure container restart succeeds

### Logs

**GitHub Actions logs:**
```bash
gh run list --branch develop
gh run view <run-id> --log
```

**Nginx container logs:**
```bash
docker logs nginx-sites --tail 50
```

**Nginx access/error logs:**
```bash
docker exec nginx-sites tail -f /var/log/nginx/jpstas_access.log
docker exec nginx-sites tail -f /var/log/nginx/jpstas_error.log
```

### Health Checks

**From pi-forge host:**
```bash
curl http://localhost:8000/health
```

**From external network:**
```bash
curl http://192.168.50.157:8000/health
```

**Check container status:**
```bash
docker ps | grep nginx-sites
docker inspect nginx-sites
```

## Alternative Configuration

### Using Ubuntu Runner with SSH

If you need to use GitHub's hosted runners instead of self-hosted:

1. Ensure pi-forge has a public IP or VPN connection
2. Uncomment the SSH-based deployment steps in workflow
3. Comment out the self-hosted deployment steps
4. Change `runs-on: self-hosted` to `runs-on: ubuntu-latest`

Note: The SSH key is already configured in GitHub secrets as `PI_FORGE_SSH_KEY`.

## Maintenance

### Updating Nginx Configuration

```bash
ssh admin@192.168.50.157
cd ~/docker/nginx-sites/conf.d
vi jpstas.com.conf
# Make changes
docker restart nginx-sites
```

### Updating Docker Compose

```bash
ssh admin@192.168.50.157
cd ~/docker/nginx-sites
vi docker-compose.yml
# Make changes
docker compose down
docker compose up -d
```

### Checking Runner Status

```bash
# Via GitHub CLI
gh api /repos/origincreativegroup/jpstas.com/actions/runners

# On pi-forge
docker ps | grep github-runner
```

## Security Notes

- The self-hosted runner runs as root - ensure repository has restricted access
- nginx container runs as unprivileged user inside container
- Static files are served without server-side execution
- Health check endpoint has access logging disabled
- Security headers are configured (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)

## Monitoring

**Check deployment status:**
- GitHub Actions: https://github.com/origincreativegroup/jpstas.com/actions
- Site URL: http://192.168.50.157:8000
- Health endpoint: http://192.168.50.157:8000/health

**Monitor container:**
```bash
docker stats nginx-sites
docker logs -f nginx-sites
```

## Related Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - General deployment procedures
- [Cloudflare Deployment](../cloudflare-pages.toml) - Production deployment configuration
- [GitHub Actions Workflows](../../.github/workflows/) - All workflow files

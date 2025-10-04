#!/bin/bash

# Production Deployment Script for jpstas.com
# This script ensures the site is production-ready before deploying

set -e  # Exit on any error

echo "🚀 Starting production deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Check if we're on the right branch
echo "📋 Step 1: Checking git status..."
if [ "$(git branch --show-current)" != "main" ]; then
    print_warning "Not on main branch. Current branch: $(git branch --show-current)"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled"
        exit 1
    fi
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_error "You have uncommitted changes. Please commit or stash them first."
    git status --short
    exit 1
fi

print_status "Git status clean"

# Step 2: Run linting
echo "📋 Step 2: Running linting..."
npm run lint
print_status "Linting passed"

# Step 3: Run type checking
echo "📋 Step 3: Running type checking..."
npm run build
print_status "Type checking and build passed"

# Step 4: Check for production environment variables
echo "📋 Step 4: Checking environment configuration..."
if [ ! -f ".env" ]; then
    print_warning "No .env file found. Make sure to set environment variables in Cloudflare Pages dashboard."
fi

print_status "Environment check complete"

# Step 5: Build for production
echo "📋 Step 5: Building for production..."
npm run build
print_status "Production build complete"

# Step 6: Deploy to Cloudflare Pages
echo "📋 Step 6: Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=jpstas-portfolio

print_status "Deployment complete! 🎉"
echo ""
echo "🔗 Your site should be available at: https://jpstas.com"
echo "📊 Monitor your deployment in the Cloudflare Pages dashboard"
echo ""
echo "📝 Next steps:"
echo "   1. Verify the site loads correctly"
echo "   2. Test admin login functionality"
echo "   3. Test file upload functionality"
echo "   4. Check that all API endpoints work"

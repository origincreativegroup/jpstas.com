#!/bin/bash

# Production Setup Script
# This script sets up the full tech stack for production deployment

set -e

echo "🚀 Setting up JP Stas Portfolio - Full Tech Stack"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    local missing_deps=()
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    if ! command -v flyctl &> /dev/null; then
        missing_deps+=("flyctl")
    fi
    
    if ! command -v wrangler &> /dev/null; then
        missing_deps+=("wrangler")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_status "Please install the missing dependencies and run this script again."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f "backend/.env" ]; then
        print_warning "backend/.env not found. Creating from template..."
        cp backend/env.example backend/.env
        print_warning "Please edit backend/.env with your actual values before continuing."
        read -p "Press Enter when you've updated backend/.env..."
    fi
    
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found. Creating from template..."
        cp env.example .env.local
        print_warning "Please edit .env.local with your actual values before continuing."
        read -p "Press Enter when you've updated .env.local..."
    fi
    
    print_success "Environment variables configured"
}

# Setup Neon database
setup_database() {
    print_status "Setting up Neon database..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Run migrations
    print_status "Running database migrations..."
    npm run migrate:up
    
    # Run seed data
    print_status "Seeding database with initial data..."
    node ../scripts/migrate-from-legacy.js
    
    cd ..
    
    print_success "Database setup completed"
}

# Deploy backend to Fly.io
deploy_backend() {
    print_status "Deploying backend to Fly.io..."
    
    cd backend
    
    # Check if fly.toml exists
    if [ ! -f "fly.toml" ]; then
        print_error "fly.toml not found. Please run 'fly launch' first."
        exit 1
    fi
    
    # Deploy to Fly.io
    print_status "Deploying to Fly.io..."
    flyctl deploy --remote-only
    
    cd ..
    
    print_success "Backend deployed to Fly.io"
}

# Deploy frontend to Cloudflare Pages
deploy_frontend() {
    print_status "Deploying frontend to Cloudflare Pages..."
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Build frontend
    print_status "Building frontend..."
    npm run build
    
    # Deploy to Cloudflare Pages
    print_status "Deploying to Cloudflare Pages..."
    npx wrangler pages deploy dist --project-name=jpstas-portfolio
    
    print_success "Frontend deployed to Cloudflare Pages"
}

# Setup GitHub Actions secrets
setup_github_secrets() {
    print_status "Setting up GitHub Actions secrets..."
    
    echo "Please add the following secrets to your GitHub repository:"
    echo ""
    echo "Required secrets:"
    echo "  - FLY_API_TOKEN: Your Fly.io API token"
    echo "  - CLOUDFLARE_API_TOKEN: Your Cloudflare API token"
    echo "  - CLOUDFLARE_ACCOUNT_ID: Your Cloudflare account ID"
    echo "  - DATABASE_URL: Your Neon database connection string"
    echo "  - VITE_API_URL: Your Fly.io backend URL"
    echo ""
    echo "Optional secrets:"
    echo "  - TEST_DATABASE_URL: Test database connection string"
    echo "  - VITE_GA_TRACKING_ID: Google Analytics tracking ID"
    echo ""
    print_warning "Go to your GitHub repository settings > Secrets and variables > Actions"
    print_warning "Add each secret with the corresponding value"
    read -p "Press Enter when you've added all the secrets..."
    
    print_success "GitHub Actions secrets configured"
}

# Main setup function
main() {
    echo ""
    print_status "Starting production setup..."
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Setup environment
    setup_environment
    
    # Setup database
    setup_database
    
    # Deploy backend
    deploy_backend
    
    # Deploy frontend
    deploy_frontend
    
    # Setup GitHub Actions
    setup_github_secrets
    
    echo ""
    print_success "🎉 Production setup completed!"
    echo ""
    echo "Your portfolio is now live at:"
    echo "  Frontend: https://jpstas-portfolio.pages.dev"
    echo "  Backend: https://jpstas-portfolio-api.fly.dev"
    echo ""
    echo "Next steps:"
    echo "  1. Update your domain DNS to point to Cloudflare Pages"
    echo "  2. Configure SSL certificates"
    echo "  3. Set up monitoring and alerts"
    echo "  4. Test all functionality"
    echo ""
}

# Run main function
main "$@"

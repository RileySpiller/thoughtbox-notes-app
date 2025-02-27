#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== ThoughtBox Notes App Deployment Helper ===${NC}"
echo -e "${BLUE}This script will help you deploy your app to Vercel${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${GREEN}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${GREEN}Initializing git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit"
fi

echo -e "${GREEN}Building the project...${NC}"
npm run build

echo -e "${GREEN}Deploying to Vercel...${NC}"
echo -e "${BLUE}You will be prompted to log in to Vercel if you haven't already.${NC}"
echo -e "${BLUE}Make sure to set up the environment variables in the Vercel dashboard:${NC}"
echo -e "${BLUE}- NEXT_PUBLIC_SUPABASE_URL${NC}"
echo -e "${BLUE}- NEXT_PUBLIC_SUPABASE_ANON_KEY${NC}"

# Deploy to Vercel
vercel

echo ""
echo -e "${GREEN}Deployment process initiated!${NC}"
echo -e "${BLUE}Once completed, your app will be available at the URL provided by Vercel.${NC}"
echo -e "${BLUE}You can also check your deployments at https://vercel.com/dashboard${NC}" 
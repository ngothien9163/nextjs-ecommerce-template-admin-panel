#!/bin/bash

# Deploy script with environment-specific metadata configuration

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment with metadata configuration...${NC}"

# Check if environment is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Please specify environment: production, staging, or development${NC}"
    echo "Usage: $0 <environment> [company-config]"
    echo "Example: $0 production company-a"
    exit 1
fi

ENVIRONMENT=$1
COMPANY_CONFIG=${2:-default}

echo -e "${YELLOW}📝 Environment: ${ENVIRONMENT}${NC}"
echo -e "${YELLOW}📝 Company Config: ${COMPANY_CONFIG}${NC}"

# Copy environment-specific metadata configuration
# NOTE: Metadata is now managed via src/config/metadata-constants.ts
# This section is kept for backward compatibility and other env vars
case $ENVIRONMENT in
    "production")
        echo -e "${GREEN}📋 Setting up production configuration...${NC}"
        echo -e "${GREEN}ℹ️  Metadata is now managed in src/config/metadata-constants.ts${NC}"
        # Keep other environment variables if needed
        ;;
    "staging")
        echo -e "${GREEN}📋 Setting up staging configuration...${NC}"
        echo -e "${GREEN}ℹ️  Metadata is now managed in src/config/metadata-constants.ts${NC}"
        if [ -f ".env.staging.example" ]; then
            cp .env.staging.example .env.staging
        fi
        ;;
    "development")
        echo -e "${GREEN}📋 Setting up development configuration...${NC}"
        echo -e "${GREEN}ℹ️  Metadata is now managed in src/config/metadata-constants.ts${NC}"
        if [ -f ".env.development.example" ]; then
            cp .env.development.example .env.development
        fi
        ;;
    *)
        echo -e "${RED}❌ Invalid environment: ${ENVIRONMENT}${NC}"
        exit 1
        ;;
esac

# Build application with environment
echo -e "${GREEN}🔨 Building application for ${ENVIRONMENT}...${NC}"
npm run build -- --mode ${ENVIRONMENT}

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"

# Deploy based on environment
case $ENVIRONMENT in
    "production")
        echo -e "${GREEN}🚢 Deploying to production...${NC}"
        # Add your production deployment commands here
        # Example: vercel --prod
        # Example: netlify deploy --prod
        ;;
    "staging")
        echo -e "${GREEN}🚢 Deploying to staging...${NC}"
        # Add your staging deployment commands here
        ;;
    "development")
        echo -e "${GREEN}🚢 Starting development server...${NC}"
        npm run dev
        ;;
esac

echo -e "${GREEN}🎉 Deployment completed for ${ENVIRONMENT} with ${COMPANY_CONFIG} configuration${NC}"
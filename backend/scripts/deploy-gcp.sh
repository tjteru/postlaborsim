#!/bin/bash

# Google Cloud Platform deployment script
set -e

echo "🚀 Deploying to Google Cloud Run..."

# Check if required environment variables are set
if [ -z "$PROJECT_ID" ]; then
    echo "❌ PROJECT_ID environment variable is required"
    exit 1
fi

if [ -z "$REGION" ]; then
    REGION="us-central1"
    echo "ℹ️  Using default region: $REGION"
fi

# Build and push Docker image
echo "📦 Building Docker image..."
docker build -t gcr.io/$PROJECT_ID/postlaborsim-backend:latest .

echo "📤 Pushing image to Google Container Registry..."
docker push gcr.io/$PROJECT_ID/postlaborsim-backend:latest

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy postlaborsim-backend \
    --image gcr.io/$PROJECT_ID/postlaborsim-backend:latest \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars NODE_ENV=production,USE_REAL_FIRESTORE=true,FIREBASE_PROJECT_ID=$PROJECT_ID \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10 \
    --port 3100

echo "✅ Deployment complete!"
echo "🌐 Your service is available at:"
gcloud run services describe postlaborsim-backend --region $REGION --format 'value(status.url)'
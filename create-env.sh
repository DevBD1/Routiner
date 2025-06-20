#!/bin/bash

# Create default .env file for Routiner project

echo "🚀 Creating default .env file for Routiner project..."
echo ""

# Check if .env file already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    echo "If you want to overwrite it, delete the existing file first."
    echo "Current .env file location: $(pwd)/.env"
    exit 1
fi

# Create .env file with template
cat > .env << 'EOF'
# Firebase Configuration
# Get these values from your Firebase project console: https://console.firebase.google.com/
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MEASUREMENT_ID=your_measurement_id
FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com

# Google OAuth Configuration
# Get these from Google Cloud Console: https://console.cloud.google.com/
GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
GOOGLE_ANDROID_CLIENT_ID=your_google_android_client_id
GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id

# AI API Keys
# Get these from their respective platforms
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Development Configuration
NODE_ENV=development
EOF

echo "✅ .env file created successfully!"
echo "📁 Location: $(pwd)/.env"
echo ""
echo "📝 Next steps:"
echo "1. Open the .env file and replace the placeholder values with your actual API keys"
echo "2. Get Firebase configuration from: https://console.firebase.google.com/"
echo "3. Get Google OAuth credentials from: https://console.cloud.google.com/"
echo "4. Get AI API keys from their respective platforms"
echo ""
echo "⚠️  Important: Never commit your .env file to version control!"
echo "   It should already be in your .gitignore file." 
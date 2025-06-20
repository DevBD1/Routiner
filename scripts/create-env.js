#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Default environment variables template
const envTemplate = `# Firebase Configuration
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
`;

// Function to create .env file
function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  
  // Check if .env file already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists!');
    console.log('If you want to overwrite it, delete the existing file first.');
    console.log('Current .env file location:', envPath);
    return;
  }

  try {
    // Create the .env file
    fs.writeFileSync(envPath, envTemplate);
    
    console.log('✅ .env file created successfully!');
    console.log('📁 Location:', envPath);
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Open the .env file and replace the placeholder values with your actual API keys');
    console.log('2. Get Firebase configuration from: https://console.firebase.google.com/');
    console.log('3. Get Google OAuth credentials from: https://console.cloud.google.com/');
    console.log('4. Get AI API keys from their respective platforms');
    console.log('');
    console.log('⚠️  Important: Never commit your .env file to version control!');
    console.log('   It should already be in your .gitignore file.');
    
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    process.exit(1);
  }
}

// Function to create scripts directory if it doesn't exist
function ensureScriptsDirectory() {
  const scriptsDir = path.join(process.cwd(), 'scripts');
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }
}

// Main execution
if (require.main === module) {
  console.log('🚀 Creating default .env file for Routiner project...');
  console.log('');
  
  ensureScriptsDirectory();
  createEnvFile();
} 
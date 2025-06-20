# Scripts Directory

This directory contains utility scripts for the Routiner project.

## Available Scripts

### create-env.js
Creates a default `.env` file with all required environment variables for the project.

**Usage:**
```bash
# Using npm script (recommended)
npm run create-env

# Or run directly
node scripts/create-env.js
```

**What it does:**
- Creates a `.env` file in the project root
- Includes all required environment variables with placeholder values
- Provides helpful comments and instructions
- Checks if `.env` already exists to prevent overwriting

**Environment Variables Included:**
- Firebase Configuration (API Key, Auth Domain, Project ID, etc.)
- Google OAuth Configuration (Web, Android, iOS Client IDs)
- AI API Keys (Gemini, OpenAI)
- Development Configuration

## Shell Script Alternative

There's also a shell script version available at the project root:

**Usage:**
```bash
# Make executable (first time only)
chmod +x create-env.sh

# Run the script
./create-env.sh
```

## Next Steps After Creating .env

1. Open the `.env` file and replace placeholder values with actual API keys
2. Get Firebase configuration from: https://console.firebase.google.com/
3. Get Google OAuth credentials from: https://console.cloud.google.com/
4. Get AI API keys from their respective platforms

⚠️ **Important:** Never commit your `.env` file to version control! It should already be in your `.gitignore` file. 
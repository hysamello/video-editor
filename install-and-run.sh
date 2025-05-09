#!/bin/bash

# Check if Node.js is installed
if ! command -v node &>/dev/null; then
  echo "Node.js is not installed. Installing Node.js..."
  # For macOS or Linux, install Node.js using nvm
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # Install Node.js for macOS using Homebrew
    if ! command -v brew &>/dev/null; then
      echo "Homebrew is not installed. Installing Homebrew first."
      /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew install node
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Install Node.js on Linux (Ubuntu/Debian example)
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
  elif [[ "$OSTYPE" == "msys"* ]]; then
    # Install Node.js for Windows using Chocolatey
    choco install nodejs
  else
    echo "Unsupported OS. Please install Node.js manually."
    exit 1
  fi
else
  echo "Node.js is already installed."
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Run the app (Vite + Electron)
echo "Running the app..."
npm run start

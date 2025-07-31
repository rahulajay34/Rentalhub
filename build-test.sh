#!/bin/bash
# Build verification script

echo "Starting build verification..."

# Check Node.js version
echo "Node.js version:"
node --version

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Navigate to client and install dependencies
echo "Installing client dependencies..."
cd client
npm install

# Build the client
echo "Building client..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo "✅ Build successful! Build directory exists."
    echo "Build contents:"
    ls -la build/
else
    echo "❌ Build failed! Build directory not found."
    exit 1
fi

echo "Build verification completed successfully!"

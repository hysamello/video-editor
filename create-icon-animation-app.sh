#!/bin/bash

# Name of the app
APP_NAME="Icon Animation"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$PROJECT_DIR/$APP_NAME.app"
SCRIPT_NAME="icon-animation.sh"

# Paths inside the .app
APP_MACOS="$APP_DIR/Contents/MacOS"
APP_INFO="$APP_DIR/Contents/Info.plist"

# 1. Create required folder structure
echo "📦 Creating $APP_NAME.app at: $APP_DIR"
mkdir -p "$APP_MACOS"

# 2. Copy your shell script into the app bundle
cp "$PROJECT_DIR/$SCRIPT_NAME" "$APP_MACOS/$SCRIPT_NAME"
chmod +x "$APP_MACOS/$SCRIPT_NAME"

# 3. Create launcher script using AppleScript for clean Terminal handling
cat > "$APP_MACOS/run" <<EOF
#!/bin/bash
osascript <<EOD
tell application "Terminal"
    activate
    set myTab to do script "chmod +x '$APP_MACOS/$SCRIPT_NAME'; '$APP_MACOS/$SCRIPT_NAME'"
    repeat until myTab is not busy
        delay 1
    end repeat
    close (every window whose frontmost is true)
end tell
EOD
EOF

chmod +x "$APP_MACOS/run"

# 4. Create Info.plist
cat > "$APP_INFO" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key>
  <string>$APP_NAME</string>
  <key>CFBundleIdentifier</key>
  <string>com.iconanimation.app</string>
  <key>CFBundleExecutable</key>
  <string>run</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>LSUIElement</key>
  <true/>
</dict>
</plist>
EOF


# 5. Done
echo "✅ Created $APP_NAME.app at $APP_DIR"

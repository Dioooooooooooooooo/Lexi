# LexiLearner - Troubleshooting Guide

## Android Build Issues

### Gradle Download Timeout

**Problem:** Gradle fails to download with timeout errors like:
```
Exception in thread "main" java.io.IOException: Downloading from https://services.gradle.org/distributions/gradle-8.10.2-all.zip failed: timeout (10000ms)
```

**Solution:**
1. Increase network timeout in `mobile/android/gradle/wrapper/gradle-wrapper.properties`:
   ```properties
   networkTimeout=60000  # Changed from 10000 to 60000 (60 seconds)
   ```

### Gradle Cache Corruption

**Problem:** Build fails with corrupted cache metadata:
```
Error resolving plugin [id: 'com.facebook.react.settings']
Could not read workspace metadata from C:\Users\admin\.gradle\caches\8.10.2\transforms\[hash]\metadata.bin
```

**Solution Steps:**
1. Stop all Gradle daemons:
   ```powershell
   cd D:\Babolat\mobile\android
   ./gradlew.bat --stop
   ```

2. Kill any remaining Java processes:
   ```powershell
   taskkill /f /im java.exe
   ```

3. If cache files are still locked, **restart Windows** to release file locks

4. Delete corrupted cache:
   ```powershell
   rm -r -Force "C:\Users\admin\.gradle\caches"
   ```

5. Retry build:
   ```powershell
   cd D:\Babolat\mobile
   npx expo run:android
   ```

### Port Conflicts

**Problem:** Metro bundler port 8081 is in use

**Solution:** Expo will automatically prompt to use alternative port (8082). Accept the suggestion.

## Common PowerShell Commands

```powershell
# Process management
Get-Process java                                    # List Java processes
taskkill /f /im java.exe                           # Kill all Java processes
Get-Process | Where-Object {$_.ProcessName -like "*gradle*"}  # Find Gradle processes

# File operations
rm -r -Force "path\to\directory"                   # Delete directory recursively
mv "old\path" "new\path"                           # Move/rename files
Test-Path "path\to\file"                           # Check if file exists

# Navigation
cd "D:\Babolat\mobile"                             # Change directory
ls                                                 # List directory contents
```

## Development Server Issues

### Metro Bundler Won't Start

**Solution:**
1. Clear Metro cache:
   ```bash
   npx expo start --clear
   ```

2. Reset Expo cache:
   ```bash
   npx expo install --fix
   ```

### Android Device Not Detected

**Solution:**
1. Enable USB debugging on Android device
2. Install ADB drivers
3. Check device connection:
   ```bash
   adb devices
   ```

## Build Environment

### Required Tools
- Node.js 18+
- pnpm (package manager)
- Java 17+ (for Android builds)
- Android SDK (via Android Studio)
- Expo CLI

### File Locations
- Gradle cache: `C:\Users\[username]\.gradle\caches`
- Android SDK: `C:\Users\[username]\AppData\Local\Android\Sdk`
- Node modules: `D:\Babolat\node_modules` (root) + individual package node_modules

## Recovery Commands

```bash
# Complete project reset
rm -r node_modules
rm package-lock.json
rm pnpm-lock.yaml
pnpm install

# Android build reset
cd mobile/android
./gradlew clean
cd ..
rm -r node_modules
pnpm install
```
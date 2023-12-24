# powershell script that runs the build process for the extension
# first build for chrome with "pnpm build"
# then zip the build folder and put it in "release/extension-chrome.zip"
# then build for firefox with "pnpm build:firefox"
# then zip the build folder and put it in "release/extension-firefox.zip"

$7zipPath = "$env:ProgramFiles\7-Zip\7z.exe"

if (-not (Test-Path -Path $7zipPath -PathType Leaf)) {
    throw "7 zip file '$7zipPath' not found"
}

Set-Alias Start-SevenZip $7zipPath

# create release folder if not exists
if (!(Test-Path release)) {
  New-Item -ItemType Directory -Force -Path release
}

# remove old release files
Remove-Item release/* -Force

# Set these enviroment variables for the build
$env:VITE_API_URL = "https://api.notan.ax"
$env:VITE_APP_URL = "https://app.notan.ax"

# build for chrome
pnpm build

# zip the build folder and put it in "release/extension-chrome.zip"
cd dist
Start-SevenZip a -mx=9 "../release/extension-chrome.zip" ./*
cd ..

# build for firefox
pnpm build:firefox

# zip the contents of the dist folder with 7zip and put it in "release/extension-firefox.zip"
cd dist
Start-SevenZip a -mx=9 "../release/extension-firefox.zip" ./*
cd ..

cd release
git clone git@github.com:robiot/notan.git
Start-SevenZip a -mx=9 "ext-source.zip" ./notan/ui/extension
cd ..

#unset the environment variables
Remove-Item Env:\VITE_API_URL
Remove-Item Env:\VITE_APP_URL

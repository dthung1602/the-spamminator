#!/usr/bin/env bash

set -e

echo "--> Start"
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BUILD_DIR="$SCRIPT_DIR/build"
RAW_CONTENT="${BUILD_DIR}/raw"

echo "--> Preparing"
if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
fi
mkdir -p "$RAW_CONTENT"

cd "$SCRIPT_DIR"
cp -r vendor scripts popup images "$RAW_CONTENT"
rm -rf "$RAW_CONTENT/images/demo"

cd "$RAW_CONTENT"

echo "--> Building FireFox extension"
cp "${SCRIPT_DIR}/manifest-v2.json" manifest.json
zip -r -FS ../the-spamminator-firefox.zip *

echo "--> Building Chrome extension"
cp "${SCRIPT_DIR}/manifest-v3.json" manifest.json
zip -r -FS ../the-spamminator-chrome.zip *

echo "--> Cleaning up"
cd ..
rm -rf "$RAW_CONTENT"

echo "--> Done"

#!/usr/bin/env bash

set -e

echo "--> Start"
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
OUTPUT_DIR="$SCRIPT_DIR/output"
RAW_CONTENT="${OUTPUT_DIR}/raw"

echo "--> Preparing"
if [ -d "$OUTPUT_DIR" ]; then
    rm -rf "$OUTPUT_DIR"
fi
mkdir -p "$RAW_CONTENT"

cd "$SCRIPT_DIR"
cp -r vendor scripts styles popup images "$RAW_CONTENT"
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

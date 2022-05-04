#!/usr/bin/env bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BUILD_DIR="$SCRIPT_DIR/build"
RAW_CONTENT="${BUILD_DIR}/raw"

if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
fi
mkdir -p "$RAW_CONTENT"

cd "$SCRIPT_DIR"
cp -r manifest.json vendor scripts popup images "$RAW_CONTENT"
rm -rf "$RAW_CONTENT/images/demo"

cd "$RAW_CONTENT"
zip -r -FS ../the-spamminator.zip *

cd ..
rm -rf "$RAW_CONTENT"

echo "Done!"

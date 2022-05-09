build:
	./build.sh
v2:
	rm manifest.json \
    ln -s manifest-v2.json manifest.json
v3:
	rm manifest.json \
    ln -s manifest-v3.json manifest.json

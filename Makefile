prepare:
	rm -rf build
	mkdir build
	python scripts/prepare.py
	cd build;zip -r data.zip .

test:
	cd vestachat; yarn test

build: test
	rm -rf vestachat/dist
	cd vestachat; yarn build
	cp vestachat/package.json vestachat/dist
	cd vestachat/dist; yarn install --production
	cd vestachat/dist;zip -r release.zip .

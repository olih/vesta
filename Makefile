prepare:
	rm -rf build
	mkdir build
	python scripts/prepare.py
	cd build;zip -r data.zip .

buildchat:
	cd vestachat; yarn test
	rm -rf vestachat/dist
	cd vestachat; yarn build
	cp vestachat/package.json vestachat/dist
	cd vestachat/dist; yarn install --production
	cd vestachat/dist;zip -r release.zip .

buildcron:
	cd vestacron; yarn test
	rm -rf vestacron/dist
	cd vestacron; yarn build
	cp vestacron/package.json vestacron/dist
	cd vestacron/dist; yarn install --production
	cd vestacron/dist;zip -r release.zip .
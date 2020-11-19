prepare:
	rm -rf build
	mkdir build
	python scripts/prepare.py
	aws s3 cp build s3://${S3_BUCKET}/vestacron --recursive

test:
	cd vestachat; yarn test
	cd vestacron; yarn test

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
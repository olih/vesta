prepare:
	rm -rf build
	mkdir build
	python scripts/prepare.py
	cd build;zip -r data.zip .

test:
	cd vespachat; yarn test

build: test
	rm -rf vespachat/dist
	cd vespachat; yarn build
	cd vespachat/dist;zip -r release.zip .

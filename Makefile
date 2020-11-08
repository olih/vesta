reset:
	rm -rf build

prepare: reset
	mkdir build
	python scripts/prepare.py

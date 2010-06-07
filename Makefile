all:
	git submodule init
	git submodule update

install:
	@# Should I really be doing this? Need a node package manager
	cp -R lib/node-promise /usr/local/lib/
	cp src/pulverize /usr/local/bin/pulverize
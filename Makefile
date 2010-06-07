all:
	git submodule init
	git submodule update

install:
	@# Should I really be doing this? Need a node package manager
	mkdir -p /usr/local/lib
	cp -R lib/node-promise /usr/local/lib/
	@# And should I really be doing this?
	mkdir -p /usr/local/bin
	@# It's probably okay that I'm doing this
	cp src/pulverize /usr/local/bin/pulverize
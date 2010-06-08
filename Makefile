SRC_DIR = src

PREFIX = .
DIST_DIR = ${PREFIX}/dist

INSTALL_BIN_DIR = /usr/local/bin
INSTALL_LIB_DIR = /usr/local/lib

VERSION = `cat VERSION`

all: init build

init:
	@@git submodule init
	@@git submodule update
	@@echo "Initialized and updated git submodules"

build:
	@@mkdir -p ${DIST_DIR}
	@@cp ${SRC_DIR}/pulverize ${DIST_DIR}/pulverize

	@@cat ${DIST_DIR}/pulverize | sed s/@VERSION/${VERSION}/ > ${DIST_DIR}/pulverize

install:
	@@mkdir -p ${INSTALL_BIN_DIR}
	@@cp ${DIST_DIR}/pulverize ${INSTALL_BIN_DIR}/pulverize
	@@echo "Installed Pulverizr to: ${INSTALL_BIN_DIR}"

	@@mkdir -p ${INSTALL_LIB_DIR}
	@@cp -R lib/node-promise ${INSTALL_LIB_DIR}
	@@echo "Installed Pulverizr dependencies"

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}
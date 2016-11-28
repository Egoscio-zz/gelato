#!/bin/bash
# start.sh

DIRNAME=$(cd $(dirname $0) && pwd)

cd $DIRNAME
java -Xmx1024M -Xms1024M -jar $DIRNAME/*.jar nogui

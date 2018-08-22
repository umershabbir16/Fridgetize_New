#!/bin/sh
SAVE_DIR=$PWD
BASE_DIR=`dirname $0`
cd $BASE_DIR
cd ../Src
zip -r ../fridgetize.zip *
cd ../
aws lambda update-function-code --function-name Fridgetize --zip-file fileb://fridgetize.zip
cd $SAVE_DIR

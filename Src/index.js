/**
    Copyright 2018 Fridgetize, Inc. All Rights Reserved.
*/

'use strict';
var Fridgetize = require('./Fridgetize');

exports.handler = function (event, context) {
    var fridgetize = new Fridgetize();
    fridgetize.execute(event, context);
};

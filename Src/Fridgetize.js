/**
    Copyright 2018 Fridgetize, Inc. All Rights Reserved.
*/

'use strict';
var AlexaSkill = require('./AlexaSkill'),
    eventHandlers = require('./EventHandlers'),
    intentHandlers = require('./IntentHandlers');

var APP_ID = undefined;//replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var skillContext = {};

/**
 * Fridgetize is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Fridgetize = function () {
    AlexaSkill.call(this, APP_ID);
    skillContext.needMoreHelp = true;
};


// Extend AlexaSkill
Fridgetize.prototype = Object.create(AlexaSkill.prototype);
Fridgetize.prototype.constructor = Fridgetize;

eventHandlers.register(Fridgetize.prototype.eventHandlers, skillContext);
intentHandlers.register(Fridgetize.prototype.intentHandlers, skillContext);

module.exports = Fridgetize;

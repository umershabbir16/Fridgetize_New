/**
    Copyright 2018 Fridgetize, Inc. All Rights Reserved.
*/

'use strict';

var registerEventHandlers = function (eventHandlers, skillContext) {
    eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
        //if user said a one short command that triggered an intent event,
        //it will start a new session, and then we should avoid speaking too many words.
        skillContext.needMoreHelp = false;
    };

   eventHandlers.onLaunch = function (launchRequest, session, response) {
       response.tell('Welcome');
       console.log('onLaunch: session: ' + JSON.stringify(session));
   };
};
exports.register = registerEventHandlers;

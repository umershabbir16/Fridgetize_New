/**
  Copyright 2018 Fridgetize, Inc. All Rights Reserved.
*/

'use strict';

var AlexaSkill = require('../AlexaSkill');
var Constants = require('./constants');
var https = require('https');
var request = require('request');

var utils = (function() {
  return {
		buildSpeechOutput: function(info){
			var speechOutput = {
				speech: "<speak>" + info + "</speak>",
				type: AlexaSkill.speechOutputType.SSML
			};
      
			return speechOutput;
		},

		buildSpeechOutputAndAsk: function(response, info){
			var speechOutput = utils.buildSpeechOutput(info);
			response.ask(speechOutput);
		},

    buildSpeechOutputAndAskWithCard: function(response, info, cardTitle, cardContent){
      var speechOutput = utils.buildSpeechOutput(info);
      response.askWithCard(speechOutput, null, cardTitle, cardContent);
    },

    buildSpeechOutputAndTell: function(response, info){
      var speechOutput = utils.buildSpeechOutput(info);
      response.tell(speechOutput);
    },

    buildSpeechOutputAndTellWithCard: function(response, info, cardTitle, cardContent){
      var speechOutput = utils.buildSpeechOutput(info);
      response.tellWithCard(speechOutput, null, cardTitle, cardContent);
    }, 
    
    getWebRequest: function(url, callback) {
      https.get(url, function (res) {
        var webResponseString = '';
 
        if (res.statusCode != 200) {
            callback(new Error("Error, Non 200 Response."));
        }
 
        res.on('data', function (data) {
            webResponseString += data;
        });
 
        res.on('end', function () {
            console.log('Got some data: ' + webResponseString);            
            var webResponseObject = JSON.parse(webResponseString);            
            if (webResponseObject.error) {
                console.log("Web error: " + webResponseObject.error.message);
                callback(new Error(webResponseObject.error.message));
            } else {
                console.log("web-service successful.");
                callback(null, webResponseObject);
            }
        });
      }).on('error', function (e) {
        console.log("Web-Service communication error: " + e.message);
        callback(new Error(e.message));
      });
    },
    
    // This method makes POST web-service call.
    makePostWebCall: function (url, req_data, session, response, callback) {
      if (session.user.accessToken == undefined || session.user.accessToken == null) {
        console.log ('This account is not linked: please link your account with Fridgetize skill.');
        callback(null);
      } else {
        console.log ('POST URL: ' + url);
        console.log ('POST Request Body: ' + req_data);
        
        var options = {
          url: url,
          method: 'POST',
          headers: {
            'authorization': 'Bearer ' + session.user.accessToken,
            'Content_Type': 'application/json',
            'Content_Length': req_data.length
          }
        };
        
        var req = https.request(options, function (res) {
          var result = '';
 
          if (res.statusCode != 200) {
            callback(Constants.UNKNOWN_ERROR);
          } else {
            callback (Constants.TELL_THANK_YOU_STR);
          }
 
          res.on('data', function (chunk) {
            result += chunk;
          });
          
          res.on('end', function () {
            console.log(result);
          });
  
          res.on('error', function (err) {
            console.log("Web-Service error in response: " + err.message);
            callback(Constants.ERR_UNABLE_TO_FULFILL_REQUEST);
          });
        });
      
        // Check error in request.
        req.on ('error', function (err) {
          console.log ("Web-Service error in request: " + err.message);
          callback (Constants.ERR_UNABLE_TO_FULFILL_REQUEST);
        });
        
        req.write(req_data);
        req.end(); 
      }   
    },
    
    // This method pulls user profile from OAuth.
    getUserProfileFromOAuth: function (session, response, callback) {
      var result = null;
      if (session.user.accessToken == undefined || session.user.accessToken == null) {
        console.log ('This account is not linked: please link your account with Fridgetize skill.');
        callback(null);
      } else {
        let options = {
          method: 'GET',
          url: Constants.FRIDGETIZE_USER_PROFILE_URL,
          headers:{
            authorization: 'Bearer ' + session.user.accessToken
          }
        };
    
        request(options, function(error, response, body) {

          if (error != null) {
            console.log(logTag + 'Error -> getUserProfileFromOAuth() -> ' + JSON.stringify(error));
            response.tell (Constants.UNKNOWN_ERROR);
            callback (null);
          }

          if (response.statusCode == 200) {
            result = JSON.parse(body);
            session.attributes.user_id = result.user_id;
            console.log ("getUserProfileFromOAuth() Response: " + JSON.stringify(result));
            callback (result);
          } else {
            console.log (Constants.ERR_UNABLE_TO_FULFILL_REQUEST);
            session.attributes.user_id = null;
            callback (null);
          }
        });
      }  
    }
  }
})();
module.exports = utils;

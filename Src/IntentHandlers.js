/**
    Copyright 2018 Fridgetize, Inc. All Rights Reserved.
*/

'use strict';
var Constants = require('./Common/constants');
var recipeHandler = require('./Handlers/RecipeHandler');

var logTag = 'IntentHandlers.js: ';
var registerIntentHandlers = function (intentHandlers, skillContext) {

  // CheckIngredientsForRecipe Intent.
  intentHandlers.CheckIngredientsForRecipeIntent = function (intent, session, response) {
    console.log('Inside CheckIngredientsForRecipeIntent: ' + JSON.stringify(intent));
    session.attributes.intentType = Constants.INTENT_TYPE_CHECK_INGREDIENTS_FOR_RECIPE;

    // Get recipe item if available.
    if (intent.slots != undefined && intent.slots.RecipeItem != undefined) {
      session.attributes.recipeItem = intent.slots.RecipeItem.value;
      recipeHandler.processRecipeIngredients(session, response);
    } else {
      session = null;
      var speechOutput = Constants.INVALID_ENTRIES_STR;
      response.tell(speechOutput);
    }  
  };

  // MakeSomething Intent.
  intentHandlers.MakeSomethingIntent = function (intent, session, response) {
    console.log('Inside MakeSomethingIntent: ' + JSON.stringify(intent));
    session.attributes.intentType = Constants.INTENT_TYPE_MAKE_SOMETHING;
    session.attributes.intentState = Constants.INTENT_STATE_CONFIRM_RECIPE;
    
    // Get recipe item if available.
    if (intent.slots != undefined && intent.slots.RecipeItem != undefined) {
      session.attributes.recipeItem = intent.slots.RecipeItem.value;
      recipeHandler.processRecipeIngredients(session, response);
    } else {
      session = null;
      var speechOutput = Constants.INVALID_ENTRIES_STR;
      response.tell(speechOutput);
    }
  };
  
  // AddItems Intent.
  intentHandlers.AddItemsIntent = function (intent, session, response) {
    console.log('Inside AddItemsIntent (intent): ' + JSON.stringify(intent));
    console.log('===================================================');
    console.log('Inside AddItemsIntent (session): ' + JSON.stringify(session));
    console.log('===================================================');
    console.log('Inside AddItemsIntent (response): ' + JSON.stringify(response));
    
    session.attributes.intentType = Constants.INTENT_TYPE_ADD_ITEMS;
    
    // Get Quantity if available.
    if (intent.slots != undefined && intent.slots.Quantity != undefined) {
      session.attributes.quantity = intent.slots.Quantity.value;
      // Get Measurement if available.
      if (intent.slots.Measurement != undefined) {
        session.attributes.measurement = intent.slots.Measurement.value;
        // Get RecipeItem if available.
        if (intent.slots.RecipeItem != undefined) {
          session.attributes.recipeItem = intent.slots.RecipeItem.value;
         
          // Add Item into Fridgetize.
          recipeHandler.addIngredients(session, response);
        } else {
          session = null;
          var speechOutput = Constants.CONFIRM_ITEM_IS_REQUIRED;
          response.tell(speechOutput);
        }
      } else {
        session = null;
        var speechOutput = Constants.CONFIRM_UNIT_OF_MEASURE_IS_REQUIRED;
        response.tell(speechOutput);
      }
    } else {
      session = null;
      var speechOutput = Constants.CONFIRM_ITEM_QUANTITY_IS_REQUIRED;
      response.tell(speechOutput);
    }
  };

  // AMAZON.YES Intent.
	intentHandlers['AMAZON.YesIntent'] = function (intent, session, response) {
		console.log("YESIntent called: Intent: " + JSON.stringify(intent));
    console.log("YESIntent called: Session: " + JSON.stringify(session));
    session.attributes.intentYesNoState = Constants.INTENT_YESNO_STATE_YES;

    switch (session.attributes.intentType){
      case Constants.INTENT_TYPE_CHECK_INGREDIENTS_FOR_RECIPE:
      case Constants.INTENT_TYPE_MAKE_SOMETHING:
        recipeHandler.processRecipeIngredients(session, response);
        break;
      case Constants.INTENT_TYPE_ADD_ITEMS:
        recipeHandler.addIngredients(session, response);
        break;  
    }
  };

  // AMAZON.NO Intent.
  intentHandlers['AMAZON.NoIntent'] = function (intent, session, response) {
  	console.log("NoIntent called: Intent: " + JSON.stringify(intent));
   	console.log("NoIntent called: Session: " + JSON.stringify(session));
    session.attributes.intentYesNoState = Constants.INTENT_YESNO_STATE_NO;
    
    switch (session.attributes.intentType){
      case Constants.INTENT_TYPE_CHECK_INGREDIENTS_FOR_RECIPE:
      case Constants.INTENT_TYPE_MAKE_SOMETHING:
        recipeHandler.processRecipeIngredients(session, response);
        break;
      case Constants.INTENT_TYPE_ADD_ITEMS:
        recipeHandler.addIngredients(session, response);
        break;
    }
  };

  // AMAZON.HELP Intent.
  intentHandlers['AMAZON.HelpIntent'] = function (intent, session, response) {
    var speechOutput = Constants.HELP_STR;
    response.tell(speechOutput);
  };

  // AMAZON.CANCEL Intent.
  intentHandlers['AMAZON.CancelIntent'] = function (intent, session, response) {
    var speechOutput = Constants.TELL_THANK_YOU_STR;
    response.tell(speechOutput);
  };

  // AMAZON.STOP Intent.
  intentHandlers['AMAZON.StopIntent'] = function (intent, session, response) {
    var speechOutput = Constants.TELL_THANK_YOU_STR;
    response.tell(speechOutput);
  }
};

exports.register = registerIntentHandlers;

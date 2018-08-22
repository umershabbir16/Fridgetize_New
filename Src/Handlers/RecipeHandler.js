/**
  Copyright 2018 Fridgetize, Inc. All Rights Reserved.
*/

'use strict';
var Constants = require('../Common/constants');
var Util = require('../Common/utils');

var RecipeHandler = (function() {
  function handleRecipe (session, response, data, recipeName) {
    var speechOutput = '';
    
    if (data.canMake == false) {
      if(data.hits == undefined || data.hits.length <= 0) {
        console.log (Constants.NO_RECIPE_FOUND.replace("{0}", recipeName));
        Util.buildSpeechOutputAndTell(response, Constants.NO_RECIPE_FOUND.replace("{0}", recipeName));
        session = null;
      } else {
        speechOutput = Constants.CONFIRM_RECIPE_INGREDIENTS_NO.replace("{0}", data.name);
        Util.buildSpeechOutputAndTell(response, speechOutput);
        session = null;
      }   
    } else {
      if (session.attributes.intentType == Constants.INTENT_TYPE_CHECK_INGREDIENTS_FOR_RECIPE) {
        speechOutput = Constants.CONFIRM_RECIPE_INGREDIENTS_YES.replace("{0}", data.name);
        Util.buildSpeechOutputAndTell(response, speechOutput);
        session = null;
      } else if (session.attributes.intentType == Constants.INTENT_TYPE_MAKE_SOMETHING) {
        var webUrl = Constants.WEB_GET_RECIPE_BY_ID.replace("{0}", data._id);
        Util.getWebRequest(webUrl, function webResonseCallback(err, recipeData) {
          if (err) {
            session = null;
            console.log (Constants.ERR_WEB_CHECK_INGREDIENTS_FOR_RECIPE.replace("{0}", recipeName) + ": " + err);
            Util.buildSpeechOutputAndTell(response, Constants.ERR_WEB_CHECK_INGREDIENTS_FOR_RECIPE.replace("{0}", recipeName));
          } else {
            if (recipeData && recipeData.length > 0) {
              session = null;
              var recipeDetail = "Description: " + recipeData.description;
              recipeDetail += "\nIngredients: ";
              for (var i=0; i<recipeData.ingredients.length; i++) {
                recipeDetail += recipeData.ingredients[i].measure + " " + (recipeData.ingredients[i].uom.toUpperCase() == recipeData.ingredients[i].name ? "" : recipeData.ingredients[i].uom) + " " + recipeData.ingredients[i].name + ". ";
              }
              
              recipeDetail += "\nProcedure: ";
              for (var j=0; j<recipeData.procedures.length; j++) {
                recipeDetail += recipeData.procedures[j].instruction + ". ";
              }
              
              speechOutput = Constants.CONFIRM_RECIPE_DETAILS_SENT.replace("{0}", recipeData.name);
              Util.buildSpeechOutputAndTellWithCard(response, speechOutput, recipeData.name.toUpperCase() + " Recipe", recipeDetail);
              session = null;
            } else {
              console.log (Constants.NO_RECIPE_FOUND.replace("{0}", recipeName));
              Util.buildSpeechOutputAndTell(response, Constants.NO_RECIPE_FOUND.replace("{0}", recipeName));
              session = null;
            }
          }
        });
      }
    }     
  }
  
  return {
    /*
      This method contains the logic for sending recipe ingredients.
    */
    processRecipeIngredients: function(session, response) {
      var recipeName = session.attributes.recipeItem;
      
      // MakeSomeThingIntent.
      if (session.attributes.intentType == Constants.INTENT_TYPE_MAKE_SOMETHING) {
        if (session.attributes.intentState == Constants.INTENT_STATE_CONFIRM_RECIPE) {
          session.attributes.intentState = Constants.INTENT_STATE_RECIPE_CONFIRMED;
          var speechOutput = Constants.CONFIRM_RECIPE_NAME.replace("{0}", recipeName);
          Util.buildSpeechOutputAndAsk(response, speechOutput);
        } else if (session.attributes.intentState == Constants.INTENT_STATE_RECIPE_CONFIRMED) {
          if (session.attributes.intentYesNoState == Constants.INTENT_YESNO_STATE_YES) {
            if (session.attributes.intentStateCollectInputsForRecipe == Constants.INTENT_STATE_COLLECT_INPUTS) {
              if (session.attributes.listRecipePointer == null || session.attributes.listRecipePointer == undefined) {
                session.attributes.listRecipePointer = 0;
                speechOutput = Constants.OK + Constants.CONFIRM_RECIPE_ONE_BY_ONE.replace('{0}', session.attributes.recipes[session.attributes.listRecipePointer].name);
                Util.buildSpeechOutputAndAsk(response, speechOutput);
              } else {
                handleRecipe (session, response, session.attributes.recipes[session.attributes.listRecipePointer], recipeName);
              }
            } else {
              var speechOutput = '';
              var webUrl = Constants.WEB_CHECK_INGREDIENTS_FOR_RECIPE.replace("{0}", recipeName);
              Util.getWebRequest(webUrl, function webResonseCallback(err, data) {
                if (err) {
                  session = null;
                  console.log (Constants.ERR_WEB_CHECK_INGREDIENTS_FOR_RECIPE.replace("{0}", recipeName) + ": " + err);
                  Util.buildSpeechOutputAndTell(response, Constants.ERR_WEB_CHECK_INGREDIENTS_FOR_RECIPE.replace("{0}", recipeName));
                } else {
                  if (data && data.length > 0) {
                    if (data.length == 1) {
                      handleRecipe (session, response, data[0], recipeName);
                    } else {
                      session.attributes.recipes = data;
                      session.attributes.intentStateCollectInputsForRecipe = Constants.INTENT_STATE_COLLECT_INPUTS;
                      speechOutput = Constants.CONFIRM_RECIPE_COUNT.replace('{0}', data.length);
                      Util.buildSpeechOutputAndAsk(response, speechOutput);
                    }            
                  } else {
                    console.log (Constants.NO_RECIPE_FOUND.replace("{0}", recipeName));
                    Util.buildSpeechOutputAndTell(response, Constants.NO_RECIPE_FOUND.replace("{0}", recipeName));
                    session = null;
                  }
                }
              });
            }
          } else if (session.attributes.intentYesNoState == Constants.INTENT_YESNO_STATE_NO) {
            if (session.attributes.listRecipePointer == null || session.attributes.listRecipePointer == undefined) {
              speechOutput = Constants.OK + Constants.TELL_THANK_YOU_STR;
              Util.buildSpeechOutputAndTell(response, speechOutput);
              session = null;
            } else {
              session.attributes.listRecipePointer = session.attributes.listRecipePointer + 1;
              if (session.attributes.listRecipePointer >= session.attributes.recipes.length) {
                speechOutput = Constants.OK + Constants.CONFIRM_NO_MORE_RECIPES;
                Util.buildSpeechOutputAndTell(response, speechOutput);
                session = null;
              } else {
                speechOutput = Constants.OK + Constants.CONFIRM_RECIPE_ONE_BY_ONE.replace('{0}', session.attributes.recipes[session.attributes.listRecipePointer].name);
                Util.buildSpeechOutputAndAsk(response, speechOutput);
              }
            }
          }
        }
      }
      
      // CheckIngredientsForRecipeIntent.
      else if (session.attributes.intentType == Constants.INTENT_TYPE_CHECK_INGREDIENTS_FOR_RECIPE) {
        if (session.attributes.intentState == null || session.attributes.intentState == undefined) {
          var speechOutput = '';
          var webUrl = Constants.WEB_CHECK_INGREDIENTS_FOR_RECIPE.replace("{0}", recipeName);
          Util.getWebRequest(webUrl, function webResonseCallback(err, data) {
            if (err) {
              session = null;
              console.log (Constants.ERR_WEB_CHECK_INGREDIENTS_FOR_RECIPE.replace("{0}", recipeName) + ": " + err);
              Util.buildSpeechOutputAndTell(response, Constants.ERR_WEB_CHECK_INGREDIENTS_FOR_RECIPE.replace("{0}", recipeName));
            } else {
              if (data && data.length > 0) {
                if (data.length == 1) {
                  handleRecipe (session, response, data[0], recipeName);
                } else {
                  session.attributes.recipes = data;
                  session.attributes.intentState = Constants.INTENT_STATE_COLLECT_INPUTS;
                  speechOutput = Constants.CONFIRM_RECIPE_COUNT.replace('{0}', data.length);
                  Util.buildSpeechOutputAndAsk(response, speechOutput);
                }            
              } else {
                console.log (Constants.NO_RECIPE_FOUND.replace("{0}", recipeName));
                Util.buildSpeechOutputAndTell(response, Constants.NO_RECIPE_FOUND.replace("{0}", recipeName));
                session = null;
              }
            }
          });
        } else if (session.attributes.intentState !== undefined && session.attributes.intentState == Constants.INTENT_STATE_COLLECT_INPUTS) {
          if (session.attributes.intentYesNoState == Constants.INTENT_YESNO_STATE_YES) {
            if (session.attributes.listRecipePointer == null || session.attributes.listRecipePointer == undefined) {
              session.attributes.listRecipePointer = 0;
              speechOutput = Constants.OK + Constants.CONFIRM_RECIPE_ONE_BY_ONE.replace('{0}', session.attributes.recipes[session.attributes.listRecipePointer].name);
              Util.buildSpeechOutputAndAsk(response, speechOutput);
            } else {
              handleRecipe (session, response, session.attributes.recipes[session.attributes.listRecipePointer], recipeName);
            }
          } else if (session.attributes.intentYesNoState == Constants.INTENT_YESNO_STATE_NO) {
            if (session.attributes.listRecipePointer == null || session.attributes.listRecipePointer == undefined) {
              speechOutput = Constants.OK + Constants.TELL_THANK_YOU_STR;
              Util.buildSpeechOutputAndTell(response, speechOutput);
              session = null;
            } else {
              session.attributes.listRecipePointer = session.attributes.listRecipePointer + 1;
              if (session.attributes.listRecipePointer >= session.attributes.recipes.length) {
                speechOutput = Constants.OK + Constants.CONFIRM_NO_MORE_RECIPES;
                Util.buildSpeechOutputAndTell(response, speechOutput);
                session = null;
              } else {
                speechOutput = Constants.OK + Constants.CONFIRM_RECIPE_ONE_BY_ONE.replace('{0}', session.attributes.recipes[session.attributes.listRecipePointer].name);
                Util.buildSpeechOutputAndAsk(response, speechOutput);
              }
            }
          } else {
            speechOutput = Constants.INVALID_ENTRIES_STR;
            Util.buildSpeechOutputAndTell(response, speechOutput);
            session = null;
          }          
        }       
      }
    }, 
    
    /*
      This method contains the logic for adding new ingredients into user's available ingredient list.
    */
    addIngredients: function(session, response) {
      var speechOutput;
      if (session.attributes.intentYesNoState == undefined && session.attributes.intentYesNoState == null) {
        if (session.attributes.itemList == undefined || session.attributes.itemList == null) {
          var itemList = [];
          session.attributes.itemList = itemList;
        }
      
        console.log ("Quantity: " + session.attributes.quantity + ", Measurement: " + session.attributes.measurement + ", RecipeItem: " + session.attributes.recipeItem);
      
        var item = {};
        item.name = session.attributes.recipeItem;
        item.weight_uom = session.attributes.measurement;
        item.volume_uom = session.attributes.quantity;
        session.attributes.itemList.push (item);
      
        speechOutput = Constants.CONFIRM_ITEM_ADDED;
        speechOutput = speechOutput.replace("{0}", session.attributes.quantity);
        speechOutput = speechOutput.replace("{1}", session.attributes.measurement);
        speechOutput = speechOutput.replace("{2}", session.attributes.recipeItem);
      
        Util.buildSpeechOutputAndAsk(response, speechOutput);
      } else if (session.attributes.intentYesNoState == Constants.INTENT_YESNO_STATE_NO) {
        if (session.attributes.itemList != undefined && session.attributes.itemList != null && session.attributes.itemList.length > 0) {
          var url = Constants.WEB_POST_BULK_ITEM_INSERT;
          var req_data = JSON.stringify(session.attributes.itemList);
          Util.makePostWebCall(url, req_data, session, response, function (result) {
            session = null;
            if (result != undefined && result != null) {
              console.log ("POST Result: " + result);
              Util.buildSpeechOutputAndTell(response, result);
            }
          }); 
        }
      } else if (session.attributes.intentYesNoState == Constants.INTENT_YESNO_STATE_YES) {
        session.attributes.intentYesNoState = null;
        Util.buildSpeechOutputAndAsk(response, Constants.CONFIRM_ADD_NEXT_ITEM);
      }
    }
  }
})();

module.exports = RecipeHandler;

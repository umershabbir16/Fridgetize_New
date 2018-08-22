'use strict';
var Util = require('./Common/utils');
var Constants = require('./Common/constants');
var recipeName = 'cookies';
var webUrl = Constants.WEB_CHECK_INGREDIENTS_FOR_RECIPE.replace("{0}", recipeName);
Util.getWebRequest(webUrl, function webResonseCallback(err, data) {
  if (err) {
    console.log (Constants.ERR_WEB_CHECK_INGREDIENTS_FOR_RECIPE.replace("{0}", recipeName) + ": " + err);
    console.log(Constants.ERR_WEB_CHECK_INGREDIENTS_FOR_RECIPE.replace("{0}", recipeName));
  } else {
    if (data.length == 1) {
      console.log ("CanMake===============>" + data[0].canMake);
      if (data[0].canMake == false) {
        if(data[0].hits.length <= 0) {
          console.log (Constants.NO_RECIPE_FOUND.replace("{0}", recipeName));
        } else {
          var speechOutput = Constants.CONFIRM_RECIPE_INGREDIENTS_NO.replace("{0}", recipeName);
          var missingIngredients = '';
          for (var i=0; i<data[0].misses.length; i++) {
            missingIngredients +=  data[0].misses[i].measure + " " + data[0].misses[i].measureUOM + " " + data[0].misses[i].name + ", ";
          }
             
          speechOutput = speechOutput.replace("{1}", missingIngredients);
          console.log ('Missing Ingredients: ' + speechOutput);
        }
      } else {
        var speechOutput = Constants.CONFIRM_RECIPE_INGREDIENTS_YES.replace("{0}", recipeName);
        console.log(speechOutput);
      }  
    }
  }          
});   

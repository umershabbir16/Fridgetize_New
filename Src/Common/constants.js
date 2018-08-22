/**
    Copyright 2018 Fridgetize, Inc. All Rights Reserved.
*/

'use strict';
var constants = (function() {
	return {
    FRIDGETIZE_USER_PROFILE_URL: "https://fridgetize.auth0.com/userinfo/",
    ERR_FRIDGETIZE_USER_PROFILE: "Error occurred while fetching user profile.",
    ERR_FRIDGETIZE_PROFILE_NOT_FOUND: "User profile not found.",
    ERR_UNABLE_TO_FULFILL_REQUEST: "Unable to fulfill the request, please try again.",
    
		INTENT_TYPE_MAKE_SOMETHING: "INTENT_TYPE_MAKE_SOMETHING",
    INTENT_TYPE_CHECK_INGREDIENTS_FOR_RECIPE: "INTENT_TYPE_CHECK_INGREDIENTS_FOR_RECIPE",
    INTENT_TYPE_ADD_ITEMS: "INTENT_TYPE_ADD_ITEMS",
    INTENT_STATE_CONFIRM_RECIPE: "INTENT_STATE_CONFIRM_RECIPE",
    INTENT_STATE_RECIPE_CONFIRMED: "INTENT_STATE_RECIPE_CONFIRMED",
    INTENT_STATE_COLLECT_INPUTS: "INTENT_STATE_COLLECT_INPUTS",
		INTENT_YESNO_STATE_YES: "YES",
		INTENT_YESNO_STATE_NO: "NO",
    TELL_THANK_YOU_STR: "Thank You.",
    CONFIRM_ITEM_IS_REQUIRED: "Item is required field, please try again.",
    CONFIRM_ITEM_QUANTITY_IS_REQUIRED: "Item quantity is required, please try again.",
    CONFIRM_UNIT_OF_MEASURE_IS_REQUIRED: "Unit of measure is required, please try again.",
    HELP_STR: "Please contact system administrator for the help.",
    INVALID_ENTRIES_STR: "Invalid entries, please start over.",
    UNKNOWN_ERROR: "Some error occurred in the system, please contact system administrator.",
    CONFIRM_RECIPE_NAME: "OK, do you want to know how to make {0}",
    CONFIRM_RECIPE_DETAILS_SENT: "OK. I have sent you a card showing the recipe for making {0}",
    CONFIRM_RECIPE_INGREDIENTS_YES: "Yes you can. You have all the ingredients available to make {0}",
    CONFIRM_RECIPE_INGREDIENTS_NO: "No, you cannot make {0}.",
    CONFIRM_RECIPE_COUNT: "There are {0} recipes found against your search criteria, do you want me to list them one by one?",
    CONFIRM_RECIPE_ONE_BY_ONE: "Do you want the recipe for {0}",
    CONFIRM_ITEM_ADDED: "{0} {1} {2} has been added to your inventory, anything else?",
    CONFIRM_ADD_NEXT_ITEM: "Please add the next item.",
    CONFIRM_NO_MORE_RECIPES: "There are no more recipes found against your search.",
    OK: "OK, ",

    WEB_CHECK_INGREDIENTS_FOR_RECIPE: "https://gbgxw0moac.execute-api.us-east-1.amazonaws.com/dev/recommendations/search/recipe?searchterm={0}",
    WEB_GET_RECIPE_BY_ID: "https://gbgxw0moac.execute-api.us-east-1.amazonaws.com/dev/recipes/public/{0}",
    WEB_POST_BULK_ITEM_INSERT: "https://gbgxw0moac.execute-api.us-east-1.amazonaws.com/dev/ingredients/bulk/private",
    ERR_WEB_CHECK_INGREDIENTS_FOR_RECIPE: "Failed to invoke web service call to get recipe for {0}",
    NO_RECIPE_FOUND: "Sorry no recipe found to make {0}, Please try again with a different keyword.",
    CONNECTION_ERROR: "Sorry I couldn't connect to the server."
	}
})();
module.exports = constants;

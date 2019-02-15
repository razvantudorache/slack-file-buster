'use strict';

(function () {
  angular.module('slackFileBuster')
    .constant('slackFileBusterConst', {
      MAX_DELETE_FILES: 20,
      DELETE_ERRORS: {
        file_not_found: "The file does not exist, or is not visible to the calling user.",
        file_deleted: "The file has already been deleted.",
        cant_delete_file: "Authenticated user does not have permission to delete this file.",
        not_authed: "No authentication token provided.",
        invalid_auth: "Some aspect of authentication cannot be validated. Either the provided token is invalid or the request originates from an IP address disallowed from making the request.",
        account_inactive: "Authentication token is for a deleted user or workspace.",
        token_revoked: "Authentication token is for a deleted user or workspace or the app has been removed.",
        no_permission: "The workspace token used in this request does not have the permissions necessary to complete the request. Make sure your app is a member of the conversation it's attempting to post a message to.",
        org_login_required: "The workspace is undergoing an enterprise migration and will not be available until migration is complete.",
        invalid_arguments: "The method was called with invalid arguments.",
        invalid_arg_name: "The method was passed an argument whose name falls outside the bounds of accepted or expected values. This includes very long names and names with non-alphanumeric characters other than _. If you get this error, it is typically an indication that you have made a very malformed API call.",
        invalid_charset: "The method was called via a POST request, but the charset specified in the Content-Type header was invalid. Valid charset names are: utf-8 iso-8859-1.",
        invalid_form_data: "The method was called via a POST request with Content-Type application/x-www-form-urlencoded or multipart/form-data, but the form data was either missing or syntactically invalid.",
        invalid_post_type: "The method was called via a POST request, but the specified Content-Type was invalid. Valid types are: application/x-www-form-urlencoded multipart/form-data text/plain.",
        missing_post_type: "The method was called via a POST request and included a data payload, but the request did not include a Content-Type header.",
        team_added_to_org: "The workspace associated with your request is currently undergoing migration to an Enterprise Organization. Web API and other platform operations will be intermittently unavailable until the transition is complete.",
        request_timeout: "The method was called via a POST request, but the POST data was either missing or truncated.",
        fatal_error: "The server could not complete your operation(s) without encountering a catastrophic error. It's possible some aspect of the operation succeeded before the error was raised."
      }
    })
})();

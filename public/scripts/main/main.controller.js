'use strict';

(function () {
  angular.module("slackDeleteFiles")
    .controller('mainController', mainController);

  mainController.$inject = ['$scope', '$http', 'notificationMessage', "slackDeleteFilesConst"];

  function mainController($scope, $http, notificationMessage, slackDeleteFilesConst) {
    var me = this;

    me.$onInit = function () {
      $scope.showSignInButton = true;

      $scope.multipleToolbar = false;

      checkAuthentication();

      $scope.signInWithSlack = signInWithSlack;

      $scope.deleteSelected = deleteSelected;
      $scope.deleteAllRowsDisplayed = deleteAllRowsDisplayed;

      defineGridColumnsAndProperties();
    };

    /**
     * Sign in action
     * @return {void}
     */
    function signInWithSlack() {
      location.href = "https://slack.com/oauth/authorize?scope=files:read,files:write:user&client_id=101540185972.527491816113";
    }

    /**
     * Delete selected rows
     */
    function deleteSelected() {
      var selectedRecords = me.grid.api.getSelectedRows();

      var filesId = [];
      _.forEach(selectedRecords, function (value) {
        filesId.push(value.id);
      });

      $http.post("delete", {
        filesId: filesId
      }).then(function (response) {
        var data = response.data;

        if (data.ok) {
          var allFilesSuccessfullyDeleted = true;

          var templateMessage = "<ul>";

          for (var i = 0; i < data.results.length; i++) {
            var result = data.results[i];

            var fileName = _.find(selectedRecords, function (o) {
              return o.id === result.fileId;
            });

            if (!result.message.ok) {
              allFilesSuccessfullyDeleted = false;
              templateMessage += "<li>" + fileName +": " + slackDeleteFilesConst.DELETE_ERRORS[result.message.error] + "</li>";
            }
          }

          templateMessage += "</ul>";

          if (allFilesSuccessfullyDeleted) {
            notificationMessage.showNotificationMessage("File successfully deleted!", "success");
          } else {
            notificationMessage.showNotificationMessage(templateMessage, "success");
          }

          me.grid.api.refreshInfiniteCache();
        }
      });
    }

    /**
     * Delete all rows displayed on UI
     */
    function deleteAllRowsDisplayed() {
      me.grid.api.forEachNode(function (rowNode, index) {
        console.log('node ' + rowNode.data.id + ' is in the grid');
      });
    }

    /**
     * Show/hide sign in button based of the authentication value
     * @return {void}
     */
    function checkAuthentication() {
      $http.get("/checkAuthentication").then(function (response) {
        $scope.showSignInButton = !response.data.success;

        if (!$scope.showSignInButton) {
          me.gridProperties.url = "/filesList";
        }
      });
    }

    function defineGridColumnsAndProperties() {
      me.gridColumns = [
        {
          minWidth: 80,
          maxWidth: 80,
          cellClass: "checkboxCell",
          checkboxSelection: true
        },
        {
          headerName: 'Actions',
          minWidth: 150,
          maxWidth: 150,
          cellClass: 'actionColumn',
          cellRenderer: actionColumnRenderer
        },
        {
          headerName: 'File',
          field: 'name',
          minWidth: 150,
          cellRenderer: fileCellRenderer
        }
      ];
      me.gridProperties = {
        url: '',
        customGridOptions: {
          suppressRowClickSelection: true,
          onSelectionChanged: selectionChangedHandler,
          rowSelection: 'multiple',
          getRowNodeId: function (data) {
            return data.id;
          }
        }
      };

      me.grid = null;

      me.rowActions = {
        deleteRow: deleteRow
      };
    }

    /**
     * Action column renderer
     * @param params
     * @returns {string}
     */
    function actionColumnRenderer(params) {
      var columnTemplate = '';

      if (params.data) {
        //the current user should not be deleted from the user list
        var deleteButton = '<li class="action deleteRow" data-row-id="' + params.node.id + '"></li>';

        columnTemplate = '<ul class="actionList">' +
          deleteButton +
          '               </ul>';
      }

      return columnTemplate;
    }

    /**
     * File cell renderer
     * @param params
     * @returns {string}
     */
    function fileCellRenderer(params) {
      var columnTemplate = '';

      if (params.data) {
        columnTemplate = "<div class='file'>" +
          "<img class='fileThumbnail' src='" + params.data.thumb + "' alt='" + params.data.name + "'>" +
          "<span class='filename'>" + params.data.name + "</span>" +
          "</div>";
      }

      return columnTemplate;
    }

    function selectionChangedHandler() {
      var hasSelectedRows = me.grid.api.getSelectedRows().length > 0;

      if ($scope.multipleToolbar !== hasSelectedRows) {
        $scope.multipleToolbar = hasSelectedRows;
        $scope.$apply();
      }
    }

    /**
     * Delete row action
     */
    function deleteRow() {
      var $button = $(this);
      var rowId = $button.data('rowId');

      $http.post("delete/" + rowId).then(function (response) {
        var data = response.data;

        if (data.ok) {
          notificationMessage.showNotificationMessage("File successfully deleted!", "success");

          me.grid.api.refreshInfiniteCache();
        } else {
          notificationMessage.showNotificationMessage(slackDeleteFilesConst.DELETE_ERRORS[data.error], "error");
        }
      });
    }
  }
})();

'use strict';

//Empresas service used to communicate Empresas REST endpoints
angular.module('empresas').factory('Empresas', ['$resource',
	function($resource) {
		return $resource('empresas/:empresaId', { empresaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
/*
  Open a modal confirmation dialog window with the UI Bootstrap Modal service.
   This is a basic modal that can display a message with okay or cancel buttons.
   It returns a promise that is resolved or rejected based on okay/cancel clicks.
   The following settings can be passed:

      message         the message to pass to the modal body
      title           (optional) title for modal window
      okButton        text for OK button. set false to not include button
      cancelButton    text for Cancel button. ste false to not include button

   */
  angular.module('empresas').service('dialogModal', ['$modal', function($modal) {
      return function (message, title, okButton, cancelButton) {
          // setup default values for buttons
          // if a button value is set to false, then that button won't be included
          okButton = okButton===false ? false : (okButton || 'Confirmar');
          cancelButton = cancelButton===false ? false : (cancelButton || 'Cancelar');

          // setup the Controller to watch the click
          var ModalInstanceCtrl = function ($scope, $modalInstance, settings) {
              // add settings to scope
              angular.extend($scope, settings);
              // ok button clicked
              $scope.ok = function () {
                  $modalInstance.close(true);
              };
              // cancel button clicked
              $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
              };
          };

          // open modal and return the instance (which will resolve the promise on ok/cancel clicks)
          var modalInstance = $modal.open({
              template: '<div class="dialog-modal"><div class="modal-header" ng-show="modalTitle"><h3 class="modal-title">{{modalTitle}}</h3></div><div class="modal-body">{{modalBody}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()" ng-show="okButton">{{okButton}}</button><button class="btn btn-warning" ng-click="cancel()" ng-show="cancelButton">{{cancelButton}}</button></div></div>',
              controller: ModalInstanceCtrl,
              resolve: {
                  settings: function() {
                      return {
                          modalTitle: title,
                          modalBody: message,
                          okButton: okButton,
                          cancelButton: cancelButton
                      };
                  }
              }
          });
          // return the modal instance
          return modalInstance;
      };
  }]);

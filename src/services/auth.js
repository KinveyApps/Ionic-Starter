export default class Auth {
  constructor($ionicModal, $ionicPopup, $rootScope, $kinvey) {
    'ngInject';

    this.$ionicModal = $ionicModal;
    this.$ionicPopup = $ionicPopup;
    this.$rootScope = $rootScope;
    this.$kinvey = $kinvey;
  }

  login() {
    return new Promise((resolve) => {
      const $scope = this.$rootScope.$new(); // Create a new $scope

      // Attach a submit handler to the $scope to login
      // the user when the form is submitted
      $scope.submit = (username, password) => {
        $scope.error = false;

        this.$kinvey.User.login(username, password).then((user) => {
          // Resolve with the user
          resolve(user);

          // Remove the modal
          $scope.modal.remove();

          // Show an alert for a successful login
          this.$ionicPopup.alert({
            title: 'Login Success',
            template: 'You have been logged in.',
            buttons: [
              {
                text: 'Ok',
                type: 'button-kinvey'
              }
            ]
          });
        }).catch(function() {
          $scope.password = undefined;
          $scope.error = true;
        });
      };

      Promise.resolve().then(() => {
        const loginModal = this.$rootScope.loginModal;

        if (loginModal) {
          loginModal.animation = undefined;
          return loginModal.remove();
        }
      }).then(() => {
        // Create a modal and show it
        this.$ionicModal.fromTemplateUrl('views/auth.html', {
          scope: $scope,
          backdropClickToClose: false,
          hardwareBackButtonClose: false
        }).then((modal) => {
          $scope.modal = modal;
          this.$rootScope.loginModal = modal;
          return modal.show();
        });
      });
    });
  }

  logout() {
    if (this.$kinvey.getActiveUser()) {
      return this.$kinvey.User.logout().then(() => {
        this.$ionicPopup.alert({
          title: 'Logout Success',
          template: 'You have been logged out.',
          buttons: [
            {
              text: 'Ok',
              type: 'button-kinvey'
            }
          ]
        });
      });
    }

    return Promise.resolve();
  }
}

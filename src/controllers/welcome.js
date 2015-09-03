class WelcomeCtrl {
  constructor($state) {
    'ngInject';

    this.$state = $state;
  }

  getStarted() {
    this.$state.go('posts');
  }
}

export default WelcomeCtrl;

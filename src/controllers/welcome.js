export default class WelcomeCtrl {
  constructor($state) {
    'ngInject';

    this.$state = $state;
  }

  getStarted() {
    this.$state.go('posts');
  }
}

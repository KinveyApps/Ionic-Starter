import MenuCtrl from '../controllers/menu';
import PostsCtrl from '../controllers/posts';
import WelcomCtrl from '../controllers/welcome';

const module = angular.module('controllers', []);
module.controller('MenuCtrl', MenuCtrl);
module.controller('PostsCtrl', PostsCtrl);
module.controller('WelcomeCtrl', WelcomCtrl);

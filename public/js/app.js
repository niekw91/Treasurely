var treasurely = angular.module('treasurely', [
  'ngRoute',
  'treasurelyControllers',
  'ui.bootstrap'
]);

treasurely.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/treasures.html',
        controller: 'TreasureController'
      }).
      when('/treasure/:treasureId', {
        templateUrl: 'partials/treasure-box.html',
        controller: 'TreasureBoxController'
      }).
      when('/drop', {
        templateUrl: 'partials/drop.html',
        controller: 'TreasureDropController'
      }).
      when('/mytreasures', {
        templateUrl: 'partials/treasure-drop.html',
        controller: 'TreasureMyController'
      }).
      when('/join', {
        templateUrl: 'partials/join.html',
        controller: 'JoinController'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

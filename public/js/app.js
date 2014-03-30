var treasurely = angular.module('treasurely', [
  'ngRoute',
  'treasurelyControllers',
  'ui.bootstrap',
  'ngCookies',
  'angularFileUpload'
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
        controller: 'TreasureDropController',
        resolve: {
            factory: isAuthenticated
        }
      }).
      when('/mytreasures', {
        templateUrl: 'partials/mytreasures.html',
        controller: 'TreasureMyController',
        resolve: {
            factory: isAuthenticated
        }
      }).
      when('/join', {
        templateUrl: 'partials/join.html',
        controller: 'JoinController'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
      }).
      when('/logout', {
        templateUrl: 'partials/login.html',
        controller: 'LogoutController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

var isAuthenticated = function ($q, $cookieStore, $location) {
    var defer = $q.defer();
    if ($cookieStore.get('logged-in')) {
        defer.resolve();
    } else {
        $location.path('/login');
    }
    return defer.promise;
};

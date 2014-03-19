var treasurelyServices = angular.module('treasurelyServices', []);

treasurelyServices.service("AuthenticationService", ['$rootScope', '$http', '$cookieStore', 
    function ($rootScope, $http, $cookieStore) {
        var isLoggedIn = false;

        this.login = function(user) {
            $http.post('http://localhost:8000/login', user).success(function(response) {
                console.log(response);
                if (response.success) {
                    $cookieStore.put('logged-in', response.token);
                    console.log($cookieStore.get('logged-in'));
                    // If success return true
                    isLoggedIn = true;
                } else {
                    // If login incorrect return false
                    isLoggedIn = false;
                }
                $rootScope.isLoggedIn = isLoggedIn;
                return isLoggedIn;
            });
        }

        this.logout = function() {
            $http.get('http://localhost:8000/logout?callback=JSON_CALLBACK&_=' + (new Date().getTime())).success(function(response) {
                console.log(response);
                if (response.success) {
                    $cookieStore.remove('logged-in');
                    isLoggedIn = false;
                }
                $rootScope.isLoggedIn = isLoggedIn;
                return isLoggedIn;
            });
        }
}]);

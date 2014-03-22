var treasurelyServices = angular.module('treasurelyServices', []);

treasurelyServices.service("AuthenticationService", ['$rootScope', '$http', '$cookieStore', '$location',
    function ($rootScope, $http, $cookieStore, $location) {
        this.login = function(user, url, redirectTo) {
            $http.post(url, user).success(function(response) {
                console.log(response);
                if (response.success) {
                    // Set logged-in cookie with given token
                    $cookieStore.put('logged-in', response.token);
                    // Set rootScope response to null
                    $rootScope.response = null;
                    // Redirect to given url
                    $location.path(redirectTo);

                } else {
                    // Set rootScope response object
                    $rootScope.response = response;
                }
            });
        }

        this.logout = function(url, redirectTo) {
            $http.get(url).success(function(response) {
                console.log(response);
                if (response.success) {
                    // Remove logged-in cookie
                    $cookieStore.remove('logged-in');
                    // After logout redirect to given url
                    $location.path(redirectTo);
                }
            });
        }
}]);

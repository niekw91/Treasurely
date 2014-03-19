/* Controllers */

var treasurelyControllers = angular.module('treasurelyControllers', ['treasurelyServices', 'treasurelyFactories']);

var baseUrl = 'http://localhost:8000/';

treasurelyControllers.controller('TreasureController', ['$scope', '$http', 'GeolocationFactory',
  function($scope, $http, geolocation) {
	    // Send command to recollect all treasures
		$scope.refresh = function() {
		    geolocation().then(function (position) {			
		    	var lat = position.coords.latitude;
				var lng = position.coords.longitude;

				var url = baseUrl + 'treasures/' + lat + '/' + lng + '?callback=JSON_CALLBACK&_=' + (new Date().getTime());

				$http.get(url).success(function(data) {
	    			$scope.treasures = data;
	    		});
		    }, function (reason) {
		        $scope.message = "Could not be determined."
		    });
		}

  		// On page loading, detect user location and send get command with latitude and longitude to server,
  		// command will return treasures that are in current range
		$scope.refresh();
}]);

treasurelyControllers.controller('TreasureMyController', ['$scope', '$http', '$cookieStore',
  function($scope, $http, $cookieStore) {
  	var userId = $cookieStore.get('logged-in');
  	if (userId) {
  		var url = baseUrl + 'treasures/' + userId + '?callback=JSON_CALLBACK&_=' + (new Date().getTime());

		$http.get(url).success(function(data) {
			$scope.treasures = data;
		});
  	} else {
  		// No user logged in
  	}
}]);

treasurelyControllers.controller('TreasureDropController', ['$scope', '$cookieStore', '$http', 'GeolocationFactory',
	function($scope, $cookieStore, $http, geolocation) {
	  	var userId = $cookieStore.get('logged-in');
  		if (userId) {
		    $scope.drop = function(treasure) {
	    	    geolocation().then(function (position) {			
	    	    	treasure.latitude = position.coords.latitude;
					treasure.longitude = position.coords.longitude;
					treasure.user_id = userId;

					var url = baseUrl + 'treasure';

	    			$http.post(url, treasure).success(function() {
	        			// Post success (redirect??)
	        		});
			    }, function (reason) {
			        $scope.message = "Could not be determined."
			    });
		    };
		} else {
			// No user logged in
		}
}]);

treasurelyControllers.controller('JoinController', ['$scope', '$http',
	function($scope, $http, $location, $rootScope) {
	    $scope.join = function(newUser) {
	    	var url = baseUrl + 'signup';

			$http.post(url, newUser).success(function(response) {
    			console.log(response);

    			$scope.response = response;
    		});
	    };

	  	$scope.myInterval = 5000;
	  	var slides = $scope.slides = [];
	  	$scope.addSlide = function() {
	    	var newWidth = 600 + slides.length;
	    	slides.push({
		      	image: 'http://whdn.williamhill.com/cms/images/vegas/uploads/600x300_PharaohsWinner.jpg',
		      	text: 'Treasurely'
		    });

	  	};
	  	for (var i=0; i<4; i++) {
	    	$scope.addSlide();
	  	}
}]);

treasurelyControllers.controller('LoginController', ['$scope', '$location', 'AuthenticationService',
	function($scope, $location, authentication) {
	    $scope.login = function(user) {
	    	// Try to login, if success redirect to home
	    	if (authentication.login(user)) {
	    		$location.path("/");
	    	} else {
	    		$scope.response = "Authentication failed";
	    	}
	    };
}]);

treasurelyControllers.controller('LogoutController', ['$scope', '$location', 'AuthenticationService',
	function($scope, $location, authentication) {
		// Try to log out, if succes redirect to login page
		if (authentication.logout()) {
			$location.path("/login");
		}
}]);

treasurelyControllers.controller('MenuController', ['$scope', '$cookieStore', '$location', '$rootScope',
	function($scope, $cookieStore, $location, $rootScope) {
  		$scope.isCollapsed = true;

  		$scope.redirect = function() {
	   		if (!$cookieStore.get('logged-in')) {
        		$location.path("/login");
    		} else {
	     		$location.path("/logout");
	     	}
  		}

  		// Watch the rootScope isLoggedIn variable

  		// On page refresh isLoggedIn will be deleted and this method will always return Login
  		$rootScope.$watch('isLoggedIn', function () {
  			if ($rootScope.isLoggedIn) {
	  			$scope.buttonText = 'Logout';
  			} else {
  				$scope.buttonText = 'Login';
  			}
  		});
}]);

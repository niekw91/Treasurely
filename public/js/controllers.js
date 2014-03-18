/* Controllers */

var treasurelyControllers = angular.module('treasurelyControllers', ['treasurelyServices']);

treasurelyControllers.controller('TreasureController', ['$scope', '$http', 'GeolocationService',
  function($scope, $http, geolocation) {
  		// On page loading, detect user location and send get command with latitude and longitude to server,
  		// command will return treasures that are in current range
	    geolocation().then(function (position) {			
	    	var lat = position.coords.latitude;
			var lng = position.coords.longitude;

			var get = 'http://localhost:8000/treasures/' + lat + '/' + lng + '?callback=JSON_CALLBACK&_=' + (new Date().getTime());

			$http.get(get).success(function(data) {
    			$scope.treasures = data;
    		});
	    }, function (reason) {
	        $scope.message = "Could not be determined."
	    });

	    // Send command to recollect all treasures
		$scope.refresh = function() {
			$http.get('http://localhost:8000/treasures/51.6877697/5.2863317?callback=JSON_CALLBACK&_=' + (new Date().getTime())).success(function(data) {
    			$scope.treasures = data;
    		});
		}

		/*
		$scope.open = function(treasure) {
			//var id = $scope.treasures
			var get = "/treasure/531c45cd0623c3e80001bd36/51.868809/5.737385";
			$http.get(get).success(function(data) {
				$scope.treasure = data;
			});
		};
		
		Socket.on('treasure:posted', function (treasure) {
			$http.get('http://localhost:8000/treasures/51.6877697/5.2863317?callback=JSON_CALLBACK&_=' + (new Date().getTime())).success(function(data) {
				$scope.treasures = data;
			});
			//$.pnotify({title: 'Vote', text: '+1 vote for ' + team.name });
		});
		*/
}]);

treasurelyControllers.controller('TreasureMyController', ['$scope', '$http', '$cookieStore',
  function($scope, $http, $cookieStore) {
  	var userId = $cookieStore.get('logged-in');
  	if (userId) {
		$http.get('http://localhost:8000/treasures/' + userId + '?callback=JSON_CALLBACK&_=' + (new Date().getTime())).success(function(data) {
			$scope.treasures = data;
		});
  	} else {
  		// No user logged in
  	}
}]);

treasurelyControllers.controller('TreasureDropController', ['$scope', '$http', 'GeolocationService',
	function($scope, $http, geolocation) {
	    $scope.drop = function(treasure) {
    	    geolocation().then(function (position) {			
    	    	treasure.latitude = position.coords.latitude;
				treasure.longitude = position.coords.longitude;
				treasure.user_id = "531b0a25b0cdec8815815a54";
    			$http.post('http://localhost:8000/treasure', treasure).success(function() {
        		
        		});
		    }, function (reason) {
		        $scope.message = "Could not be determined."
		    });
	    };
	 
	    // $scope.reset = function() {
	    //   $scope.user = angular.copy($scope.master);
	    // };
	 
	    // $scope.reset();
}]);

treasurelyControllers.controller('JoinController', ['$scope', '$http',
	function($scope, $http, $location, $rootScope) {
	    $scope.join = function(newUser) {
			$http.post('http://localhost:8000/signup', newUser).success(function(response) {
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

treasurelyControllers.controller('LoginController', ['$scope', '$http', '$location', '$cookieStore',
	function($scope, $http, $location, $cookieStore) {
	    $scope.login = function(user) {
			$http.post('http://localhost:8000/login', user).success(function(response) {
    			console.log(response);
    			if (response.success) {
    				$cookieStore.put('logged-in', response.token);
    				console.log($cookieStore.get('logged-in'));
    				// If success redirect to home page
    				$location.path("/");
    			} else {
    				// If login incorrect show error message
    				$scope.response = response;
    			}
    		});
	    };
}]);

treasurelyControllers.controller('LogoutController', ['$scope', '$http', '$location', '$cookieStore',
	function($scope, $http, $location, $cookieStore) {
		$http.get('http://localhost:8000/logout?callback=JSON_CALLBACK&_=' + (new Date().getTime())).success(function(response) {
			console.log(response);
			if (response.success) {
				$cookieStore.remove('logged-in');
			}
		});
}]);

treasurelyControllers.controller('MenuController', ['$scope', '$cookieStore', 
	function($scope, $cookieStore) {
  		$scope.isCollapsed = true;

	   	$scope.isAuthenticated = function() {
	   		if (!$cookieStore.get('logged-in')) {
        		return false;
    		} else {
	     		return true;
	     	}
	   	}
}]);

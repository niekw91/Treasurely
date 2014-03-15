/* Controllers */

var treasurelyControllers = angular.module('treasurelyControllers', ['treasurelyServices']);

treasurelyControllers.controller('TreasureController', ['$scope', '$http',
  function($scope, $http) {
  		// For UI bootstrap
  		//$scope.isCollapsed = true;
  		
  		//$scope.treasures = function($scope, $http) {
    		$http.get('http://localhost:8000/treasures/51.6877697/5.2863317?callback=JSON_CALLBACK&_=' + (new Date().getTime())).success(function(data) {
        		$scope.treasures = data;
        	});
		//}
		
		/*
    	var getTreasures = "http://localhost:8000/treasures/51.868809/5.737385";

    	$scope.treasures = function() {
    	 	var Treasure = $resource(getTreasures);
	  		var treasure = Treasure.get({}, function() {
		    	$scope.treasures = data;
		  	});
			$http.get(getTreasures).success(function(data) {
				
			});
    	}

		
		$scope.open = function(treasure) {
			//var id = $scope.treasures
			var get = "/treasure/531c45cd0623c3e80001bd36/51.868809/5.737385";
			$http.get(get).success(function(data) {
				$scope.treasure = data;
			});
		};

		//Socket.on('treasure:posted', function (treasures) {
			//$http.get('/teams').success(function(data) {
			//	$scope.teams = data;
			//});
			//$.pnotify({title: 'Vote', text: '+1 vote for ' + team.name });
		//});
		*/
}]);

treasurelyControllers.controller('TreasureMyController', ['$scope', '$http', '$rootScope',
  function($scope, $http, $rootScope) {
  	//var userId = $rootScope.token;

	$http.get('http://localhost:8000/treasures/531b0a25b0cdec8815815a54?callback=JSON_CALLBACK&_=' + (new Date().getTime())).success(function(data) {
		$scope.treasures = data;
	});
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
}]);

treasurelyControllers.controller('LoginController', ['$scope', '$http', '$location', '$rootScope',
	function($scope, $http, $location, $rootScope) {
	    $scope.login = function(user) {
			$http.post('http://localhost:8000/login', user).success(function(response) {
    			console.log(response);
    			if (response.success) {
    				$rootScope.token = response.token;
    				// If success redirect to home page
    				$location.path("/");
    			} else {
    				// If login incorrect show error message
    				$scope.response = response;
    			}
    		});
	    };
}]);

treasurelyControllers.controller('LogoutController', ['$scope', '$http', '$location', '$rootScope',
	function($scope, $http, $location, $rootScope) {
	    $scope.logout = function() {
			$http.post('http://localhost:8000/logout').success(function(response) {
    			console.log(response);
    			if (response.success) {
    				$rootScope.token = null;
    				// If success redirect to home page
    				$location.path("/");
    			}
    		});
	    };
}]);

treasurelyControllers.controller('MenuController', ['$scope', '$rootScope',
	function($scope, $rootScope) {
  		$scope.isCollapsed = true;

	   	$scope.isAuthenticated = function() {
	     	if(!$rootScope.token) {
	     		return false;
	     	} else {
	     		return true;
	     	}
	   	}
}]);

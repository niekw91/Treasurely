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

treasurelyControllers.controller('MenuController', ['$scope',
	function($scope) {
  		$scope.isCollapsed = true;

  		$scope.routeTreasure = "/treasure/:treasureId";
  		$scope.drop = "#/drop";
}]);

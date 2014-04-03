/* Controllers */

var treasurelyControllers = angular.module('treasurelyControllers', ['treasurelyServices', 'treasurelyFactories']);

var baseUrl = 'http://localhost:7000/';

treasurelyControllers.controller('TreasureController', ['$scope', '$http', 'GeolocationFactory', '$location',
  function($scope, $http, geolocation, $location) {
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

	  	$scope.open = function(treasure) {
	  		$location.path('/treasure/' + treasure._id);
	  	}

        $scope.selected = 0;
        $scope.setSelected = function(selection) {
            $scope.selected = selection; 
        }

  		// On page loading, detect user location and send get command with latitude and longitude to server,
  		// command will return treasures that are in current range
		$scope.refresh();
}]);

treasurelyControllers.controller('TreasureBoxController', ['$scope', '$http', '$routeParams', '$cookieStore', 'GeolocationFactory', 
   function($scope, $http, $routeParams, $cookieStore, geolocation) {
	    geolocation().then(function (position) {			
		    	var lat = position.coords.latitude;
				var lng = position.coords.longitude;
                var treasureId = $routeParams.treasureId;

				var url = baseUrl + 'treasure/' + treasureId + '/' + lat + '/' + lng + '?callback=JSON_CALLBACK&_=' + (new Date().getTime());

				$http.get(url).success(function(data) {
	    			$scope.treasure = data[0];
				    if ($scope.treasure) {
				    	$scope.showImage = function() {
				    		var imageUrl = baseUrl + 'treasure/image/' + $scope.treasure._id

				    		var Image = $resource(imageUrl);

						    $scope.image = Image.get();
				    		$http.get(imageUrl).success(function(data) {
				    			$scope.image = data;
				    			$scope.image = new Image(data);
				    		});
				    	}

				    	$scope.getComments = function() {
				   			var url = baseUrl + 'comments/' + $scope.treasure._id + '?callback=JSON_CALLBACK&_=' + (new Date().getTime());

							$http.get(url).success(function(data) {
				    			$scope.comments = data;
				    		});
			   			}

			   			$scope.send = function(newComment) {
						  	var userId = $cookieStore.get('logged-in');
					  		if (userId) {
					   			var url = baseUrl + 'treasure/' + $scope.treasure._id;

					   			newComment.user_id = userId;

								$http.put(url, newComment).success(function(data) {
					    			$scope.getComments();
									// Clear textfield;
									$scope.newComment.text = '';
					    		});
							} else {
								// no user logged in
								alert('You must be logged in to place comments!');
							}
			   			}
				   		// When page loading, get comments
				   		$scope.getComments();
				
			    	} else {
						// Treasure out of range
						alert('Treasure out of range!');
					}	
	    		});
	    }, function (reason) {
	        $scope.message = "Could not be determined."
		});
}]);

treasurelyControllers.controller('TreasureMyController', ['$scope', '$http', '$cookieStore', '$location',
  function($scope, $http, $cookieStore, $location) {
  		$scope.refresh = function() {
		  	var userId = $cookieStore.get('logged-in');
		  	if (userId) {
		  		var url = baseUrl + 'treasures/' + userId + '?callback=JSON_CALLBACK&_=' + (new Date().getTime());

				$http.get(url).success(function(data) {
					$scope.treasures = data;
				});
		  	} else {
		  		// No user logged in
		  	}
  		}

	  	$scope.open = function(treasure) {
	  		$location.path('/treasure/' + treasure._id);
	  	}

	  	$scope.delete = function(treasure) {
	  		var delUrl = baseUrl + 'treasure/' + treasure._id;
			$http.delete(delUrl).success(function() {
				$scope.refresh();
			});
	  	}
      
        $scope.selected = 0;
        $scope.setSelected = function(selection) {
            $scope.selected = selection; 
        }

  		// On page loading
		$scope.refresh();
}]);

treasurelyControllers.controller('TreasureDropController', ['$scope', '$cookieStore', '$http', 'GeolocationFactory', '$location', '$upload',
	function($scope, $cookieStore, $http, geolocation, $location, $upload) {
	  	var userId = $cookieStore.get('logged-in');
  		if (userId) {
  			var file = null;
			$scope.onFileSelect = function($files) {
	            for (var i = 0; i < $files.length; i++) {
	                file = $files[i];
	            }
    		};

		    $scope.drop = function(treasure) {
	    	    geolocation().then(function (position) {			
	    	    	treasure.latitude = position.coords.latitude;
					treasure.longitude = position.coords.longitude;
					treasure.user_id = userId;

					var url = baseUrl + 'treasure';

	    			$http.post(url, treasure).success(function(treasureId) {
	    				console.log(baseUrl + 'upload');
    				  	$scope.upload = $upload.upload({
		                    url: baseUrl + 'upload',
		                    data: { id: treasureId },
		                    file: file
		                }).progress(function(evt) {
		                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
		                }).success(function(data, status, headers, config) {
		                    // file is uploaded successfully
    	        			$location.path('/');
		                });
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
		      	image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTysXyho07701XYKHOmQIM2vMlEBTR1MjXUtinZ-Eiahb5Y2iU5',
		      	text: 'Treasurely'
		    });

	  	};
	  	for (var i=0; i<4; i++) {
	    	$scope.addSlide();
	  	}
}]);

treasurelyControllers.controller('LoginController', ['$scope', '$location', '$rootScope', 'AuthenticationService',
	function($scope, $location, $rootScope, authentication) {
    	$scope.response = null;
	    $scope.login = function(user) {
	    	var url = baseUrl + 'login';
	    	var redirectTo = '/';
	    	// Try to login, if success redirect to home
	    	authentication.login(user, url, redirectTo);

	  		$rootScope.$watch('response', function () {
	  			if ($rootScope.response) {
		  			$scope.response = $rootScope.response;
	  			} else {
	  				$scope.response = null;
	  			}
  			});
	    };
}]);

treasurelyControllers.controller('LogoutController', ['$scope', '$location', 'AuthenticationService',
	function($scope, $location, authentication) {
    	var url = baseUrl + 'logout?callback=JSON_CALLBACK&_=' + (new Date().getTime());
    	var redirectTo = '/login';
		// Try to log out, if succes redirect to login page
		authentication.logout(url, redirectTo);
}]);

treasurelyControllers.controller('MenuController', ['$scope', '$cookieStore', '$location', 
	function($scope, $cookieStore, $location) {
  		$scope.isCollapsed = true;

  		$scope.redirect = function() {
	   		if (!$cookieStore.get('logged-in')) {
        		$location.path("/login");
    		} else {
	     		$location.path("/logout");
	     	}
  		}

  		// Watch the cookieStore logged-in object
  		$scope.$watch(function() { return $cookieStore.get('logged-in'); }, function () {
  			if ($cookieStore.get('logged-in')) {
	  			$scope.buttonText = 'Logout';
  			} else {
  				$scope.buttonText = 'Login';
  			}
  		});

        // handles the callback from the received event
        var handleCallback = function(event) {
            $scope.$apply(function() {
                $scope.dropcount = event.data;
            });
        }
 
        var source = new EventSource(baseUrl + 'stream/activecount');
        source.addEventListener('count', handleCallback, false);
}]);

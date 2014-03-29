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

treasurelyControllers.controller('TreasureBoxController', ['$scope', '$http', '$routeParams', '$cookieStore', 'GeolocationFactory', '$resource',
   function($scope, $http, $routeParams, $cookieStore, geolocation, $resource) {
	    geolocation().then(function (position) {			
		    	var lat = position.coords.latitude;
				var lng = position.coords.longitude;
                var treasureId = $routeParams.treasureId;

				var url = baseUrl + 'treasure/' + treasureId + '/' + lat + '/' + lng + '?callback=JSON_CALLBACK&_=' + (new Date().getTime());

				$http.get(url).success(function(data) {
	    			$scope.treasure = data[0];
				    if ($scope.treasure) {
				    	// $scope.showImage = function() {
				    	// 	var imageUrl = baseUrl + 'treasure/image/' + $scope.treasure._id

				    	// 	var Image = $resource(imageUrl);

						   //  $scope.image = Image.get();
				    	// 	// $http.get(imageUrl).success(function(data) {
				    	// 	// 	$scope.image = data;
				    	// 	// 	//$scope.image = new Image(data);
				    	// 	// });
				    	// }

				    	$scope.getComments = function() {
				   			var url = baseUrl + 'comments/' + $scope.treasure._id;

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
            //$files: an array of files selected, each file has name, size, and type.
	            for (var i = 0; i < $files.length; i++) {
	                file = $files[i];
	                  //.error(...)
	                  //.then(success, error, progress); 
	                  //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
	            }
            /* alternative way of uploading, send the file binary with the file's content-type.
               Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
               It could also be used to monitor the progress of a normal http post/put request with large data*/
            // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
    		};

		    $scope.drop = function(treasure) {
	    	    geolocation().then(function (position) {			
	    	    	treasure.latitude = position.coords.latitude;
					treasure.longitude = position.coords.longitude;
					treasure.user_id = userId;

					var url = baseUrl + 'treasure';

	    			$http.post(url, treasure).success(function(treasureId) {
	    				console.log(treasureId);
    				  	$scope.upload = $upload.upload({
		                    url: baseUrl + 'upload', //upload.php script, node.js route, or servlet url
		                    // method: POST or PUT,
		                    // headers: {'header-key': 'header-value'},
		                    // withCredentials: true,
		                    data: { id: treasureId },
		                    file: file, // or list of files: $files for html5 only
		                    /* set the file formData name ('Content-Desposition'). Default is 'file' */
		                    //fileFormDataName: myFile, //or a list of names for multiple files (html5).
		                    /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
		                    //formDataAppender: function(formData, key, val){}
		                }).progress(function(evt) {
		                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
		                }).success(function(data, status, headers, config) {
		                    // file is uploaded successfully
		                    console.log(data);
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
		      	image: 'http://whdn.williamhill.com/cms/images/vegas/uploads/600x300_PharaohsWinner.jpg',
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

        // // handles the callback from the received event
        // var handleCallback = function(event) {
        //     $scope.$apply(function() {
        //     	console.log(event.data);
        //         $scope.dropcount = event.data;
        //     });
        // }
 
        // var source = new EventSource(baseUrl + 'stream/dropcount');
        // source.addEventListener('date', handleCallback, false);
}]);

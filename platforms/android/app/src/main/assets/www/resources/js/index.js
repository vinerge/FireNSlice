var app = angular.module('App', ['onsen', 'ngSanitize']);

app.controller('Controller', function($scope, $http) {
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.merchantID = 3;
	$scope.baseURL = 'https://live.getordering.com.au/';
	//document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	
	$scope.init = function($scope) {
		$scope.getAppData();
	};
	
	$scope.alert = function(message) {
		ons.notification.alert(message);
	};
	
	$scope.getAppData = function() {
	
		//get preferred location 
		if (typeof(localStorage.getItem('setLocation')) == 'string') {
			$scope.setLocation = JSON.parse(localStorage.getItem('setLocation'));
		}
	
		$http.post( $scope.baseURL + 'API/get_appdata', $.param({'merchant_id': $scope.merchantID}))
		.then(function( response ) {
		//document.addEventListener('deviceready', $scope.deviceReady, false);
			var data = response.data;
			if (data.locations !== undefined) {
				$scope.locations = data.locations;
			}
			
			if (data.merchant !== undefined) {
				$scope.merchant = data.merchant;
			}
			
			if (data.photos !== undefined) {
				$scope.photos = data.photos;
			}
			
			if (data.offers !== undefined) {
				$scope.offers = [];
				for (var i = 0; i < data.offers.length; i++)  {
					if (data.offers[i].location_id == 0) { 
						$scope.offers.push(data.offers[i]);
					} else {
						//match with preffed location to filter offers
						if ($scope.setLocation !== undefined && data.offers[i].location_id == $scope.setLocation.location_id) {
							$scope.offers.push(data.offers[i]);
						}
					}
				}
			}
			
			if ($scope.merchant.merchant_bg !== undefined) {
				var url = $scope.baseURL + 'uploads/images/merchant/' + $scope.merchant.merchant_bg;
				$('.ui-panel-wrapper').css('background-image', 'url(' + url + ')');
			}
			
			if ($scope.setLocation !== undefined) { 
				$scope.loadTemplate('deals.html');
			} else {
				$scope.loadTemplate('landing.html');
			}
		});
	};
	
	$scope.changeLocation = function(locationObj) {
		localStorage.setItem('setLocation', JSON.stringify(locationObj));
		location.reload();
	};
	
	$scope.submitContact = function() {
		if (! $('#contactForm').valid()) return;
		
		$http.post( $scope.baseURL +'API/submit_contact/', $('#contactForm').serialize())
		.then(function( response ) {
			$('#contactForm')[0].reset();
			alert('Your message has been sent successfully.');
		});
	};
	
	$scope.submitReservation = function() {
		
		$http.post( $scope.baseURL +'API/submit_reservation/', $('#reservationForm').serialize())
		.then(function( response ) {
			$('#reservationForm')[0].reset();
			alert('Your message has been sent successfully.');
		});
	};
	
	$scope.loadTemplate = function(template) {
		mySplitter.content.load(template).then(function(){ 
			mySplitter.left.close();
		});
	};
	
});
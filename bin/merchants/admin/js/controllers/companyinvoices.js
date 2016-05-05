'use strict';

angular.module('app')
.controller('CompanyInvoicesCtrl', ['$scope', '$http', '$state', 'acsManager', '$sce', '$modal', '$filter', function($scope, $http, $state, acsManager, $sce, $modal, $filter) {
	$scope.user = acsManager.info();

	$scope.invoices = [];

	if ($scope.user == null) {
		$state.go('access.signin');
		return;
	}

	acsManager.getCompanyInvoices(function(err, invoices) {
		$scope.invoices = invoices;
		$scope.$apply();
	});


	var SendInvoice = function(token, id) {

		var auth_token = "Bearer " + token;

		$.ajax({
			type: "POST",
			url: "https://api.sandbox.paypal.com/v1/invoicing/invoices/" + id + "/send",
			data: "",

			success: function(data) {
				alert("Invoice " + id + " has been sent.");				
			},
			dataType: "text",
			contentType: "application/json",
			beforeSend: function (xhr) {
			    xhr.setRequestHeader ("Authorization", auth_token);
			},
			headers: {
				"Authorization": auth_token	
			}

		}).fail(function() {
			console.log(arguments);
		});
	};


	var CreateInvoice = function(token, obj) {

		var invoice = {
		  "merchant_info": {
		    "email": "hayk-facilitator@hayotsyan.com",
		    "first_name": "Hayk",
		    "last_name": "Hayotsyan",
		    "business_name": "Photopon, LLC",
		    "phone": {
		      "country_code": "001",
		      "national_number": "5032141716"
		    },
		    "address": {
		      "line1": "1234 Main St.",
		      "city": "Portland",
		      "state": "OR",
		      "postal_code": "97217",
		      "country_code": "US"
		    }
		  },
		  "billing_info": [{
		    "email": obj.get('user').get('email')
		  }],
		  
		  "items": [],

		  "note": "Medical Invoice 16 Jul, 2013 PST",
		  "payment_term" :{
			  "term_type": "NET_45"
		  },
		  "shipping_info": {
		    "first_name": "Sally",
		    "last_name": "Patient",
		    "business_name": "Not applicable",
		    "address": {
		    "line1": "1234 Broad St.",
		    "city": "Portland",
		    "state": "OR",
		    "postal_code": "97216",
		    "country_code": "US"
		    }
		  }
		};

		invoice.items.push({
		    "name": "Photopon shares",
		    "quantity": obj.get("currentShares"),
		    "unit_price": {
			    "currency": "USD",
			    "value": 0.05
		    }
		});
		invoice.items.push({
		    "name": "Photopon redeems",
		    "quantity": obj.get("currentRedeems"),
		    "unit_price": {
			    "currency": "USD",
			    "value": 0.25
		    }
		});

		
		var auth_token = "Bearer " + token;
		
		$.ajax({
			type: "POST",
			url: "https://api.sandbox.paypal.com/v1/invoicing/invoices",
			data: JSON.stringify(invoice),

			success: function(data) {
				SendInvoice(token, data.id);
				
			},
			dataType: "json",
			contentType: "application/json",
			beforeSend: function (xhr) {
			    xhr.setRequestHeader ("Authorization", auth_token);
			},
			headers: {
				"Authorization": auth_token	
			}

		}).fail(function() {
			console.log(arguments);
		});
	};

	$scope.payInvoice = function(obj) {
		console.log(obj);


		var paypalClientID = "AaUsvkXgNMX55PlPdlJSjBysDDqbwOBVd1ffEIbAGY_O9kFMTdriIMuyKk2Oe0TU7uEQQoWO54eqR9ed";
		var paypalSecret = "EJGASmjKqxP12aEKgN5N8ojWetBbMKe59y7OmiAE0rlz5Ng9ZtEZ1tAyOeQe7oq-2AfQoqd3Z0Uejv_B";

		var tok = paypalClientID + ':' + paypalSecret;
    	var auth_token = "Basic " + btoa(tok);
		
		$.ajax({
			type: "POST",
			url: "https://api.sandbox.paypal.com/v1/oauth2/token",
			data: "grant_type=client_credentials",

			success: function(data) {
				console.log(data.access_token);
				CreateInvoice(data.access_token, obj.c);

			},
			dataType: "json",
			contentType: "application/x-www-form-urlencoded",
			beforeSend: function (xhr) {
			    xhr.setRequestHeader ("Authorization", auth_token);
			},
			headers: {
				"Authorization": auth_token	
			}

		}).fail(function() {
			console.log(arguments);
		});
			
	}

}]);


































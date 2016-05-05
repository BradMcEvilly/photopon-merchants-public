angular.module('app')

.factory('acsManager', ['$http', function($http) {

	var userInfo = null;


	var AcsLogin = function(username, password, callback) {
		

		Parse.User.logIn(username, password, {
		  success: function(user) {
	  		userInfo = user;
			//localStorage.setItem("userInfo", JSON.stringify(userInfo));
			callback(null, userInfo);
		    
		  },
		  error: function(user, error) {
			callback(new Error('Invalid username or password. Please try again.'));

		  }
		});
	};

	var AcsIsLoggedIn = function() {
		if (Parse.User.current()) {
			return true;
		}
		return false;
	};




	var AcsGetInfo = function() {
		return Parse.User.current();
	};

	var AcsLogout = function() {
		Parse.User.logOut();
		console.log("Logging out from parse");
		
	};

/*
 ######   #######  ##     ## ########   #######  ##    ## 
##    ## ##     ## ##     ## ##     ## ##     ## ###   ## 
##       ##     ## ##     ## ##     ## ##     ## ####  ## 
##       ##     ## ##     ## ########  ##     ## ## ## ## 
##       ##     ## ##     ## ##        ##     ## ##  #### 
##    ## ##     ## ##     ## ##        ##     ## ##   ### 
 ######   #######   #######  ##         #######  ##    ## 
*/


	var AcsNumAllCoupons = function(callback) {
		var query = new Parse.Query("Coupon");

		query.count({
			success: function(count) {
				callback(null, count);			
			},

			error: function(error) {
				callback(new Error("Failed to get coupons"), null);
			}
		});
	};


	var AcsGetCoupon = function(id, callback) {
	
		var query = new Parse.Query("Coupon");
		query.include("company");

		query.get(id, {
			success: function(object) {
				callback(null, object);			
			},

			error: function(object, error) {
				callback(new Error("Failed to get coupon"), null);
			}
		});
		
	};



	var AcsGetCoupons = function(callback, allCoupons) {
		AcsGetLocations(function(err, allLocations) {

		
			var query = new Parse.Query("Coupon");
			query.include("company");
			query.include("company.merchant");

			if (!allCoupons) {
				query.equalTo("owner", Parse.User.current());
			}
			
			query.find({
				success: function(results) {



					for (var i = 0; i < results.length; i++) {

						results[i].getShareRato = function() {
							var numShared = this.get('numShared');
							var numRedeemed = this.get('numRedeemed');

							return Math.floor(100 * numRedeemed / numShared) + "%";
						};

						results[i].getLocationTitleFull = function() {
							var locs = this.get("locations");
							var locString = "";
							

							if (locs.length == 0) {
								locs = [];
								for (var j = 0; j < allLocations.length; j++) {
									locs.push(allLocations[j].id);
								}
							} 

							for (var i = 0; i < locs.length; i++) {

								for (var j = 0; j < allLocations.length; j++) {
									if (allLocations[j].id == locs[i]) {
										locString += allLocations[j].get("name");
										if (locs.length - 1 != i) {
											locString += ", ";
										}
									}
								};

							};

							return locString;
						};

						results[i].getLocationTitle = function() {
							var locs = this.get("locations");

	
							if (locs.length == 0) {
								return "All Locations";
							} else if (locs.length > 3) {
								return "3+ Locations";
							} else {
								var locString = "";
								for (var i = 0; i < locs.length; i++) {

									for (var j = 0; j < allLocations.length; j++) {
										if (allLocations[j].id == locs[i]) {
											locString += allLocations[j].get("name");
											if (locs.length - 1 != i) {
												locString += ", ";
											}
										}
									};

								};

								return locString;
							}

							return "Error!!!";
						};

					};
					
					callback(null, results);			
				},

				error: function(error) {
				// error is an instance of Parse.Error.
					callback(new Error('Failed to get coupons'));
				}
			});
		}, allCoupons);

	};



	var AcsAddCoupon = function(data, callback) {
		
		AcsGetCompany(function(error, company) {
			if (error) {
				alert("Can not get company info");
				return;
			}

			var CouponClass = Parse.Object.extend("Coupon");
			var coupon = new CouponClass();

			coupon.set("title", data.title);
			coupon.set("description", data.body);
			coupon.set("code", data.code);
			coupon.set("company", company);
			coupon.set("expiration", data.expiration);
			coupon.set("locations", data.locations);

			coupon.set("owner", Parse.User.current());


			coupon.save(null, {
				success: function(coupon) {
					callback();
				},
				error: function(coupon, error) {
					alert("Failed to save object.");
				}
			});

		});
		
	};

	var AcsEditCoupon = function(id, data, callback) {
		var query = new Parse.Query("Coupon");
		query.include("company");

		query.get(id, {
			success: function(object) {

				object.set("title", data.title);
				object.set("description", data.body);
				object.set("code", data.code);
				object.set("expiration", data.expiration);
				object.set("locations", data.locations);

				object.save(null, {
					success: function(coupon) {
						callback();
					},
					error: function(coupon, error) {
						alert("Failed to save object.");
					}
				});
			},

			error: function(object, error) {
				callback(new Error("Failed to get coupon"), null);
			}
		});

		
		
	};



/*
##        #######   ######     ###    ######## ####  #######  ##    ## 
##       ##     ## ##    ##   ## ##      ##     ##  ##     ## ###   ## 
##       ##     ## ##        ##   ##     ##     ##  ##     ## ####  ## 
##       ##     ## ##       ##     ##    ##     ##  ##     ## ## ## ## 
##       ##     ## ##       #########    ##     ##  ##     ## ##  #### 
##       ##     ## ##    ## ##     ##    ##     ##  ##     ## ##   ### 
########  #######   ######  ##     ##    ##    ####  #######  ##    ## 
*/

	var AcsGetLocation = function(id, callback) {
	
		var query = new Parse.Query("Location");

		query.get(id, {
			success: function(object) {
				callback(null, object);			
			},

			error: function(object, error) {
				callback(new Error("Failed to get object"), null);
			}
		});
		
	};

	var AcsGetLocations = function(callback, allLocations, uiupdater) {
		
		var query = new Parse.Query("Location");
		query.include("owner");

		if (!allLocations) {
			query.equalTo("owner", Parse.User.current());
		}

		query.find({
			success: function(results) {

				for (var i = 0; i < results.length; i++) {
					results[i].fetchEverything = function() {
						var obj = this;
						var merchant = obj.get('owner');

						obj.companyName = "Loading...";

						var query2 = new Parse.Query("Company");
						query2.equalTo("merchant", merchant);

						query2.find({
							success: function(company) {
								obj.companyName = company[0].get("name");
								if (uiupdater) uiupdater();		
							},
							error: function(error) {
								obj.companyName = "Not Found!";
								if (uiupdater) uiupdater();		
							}
						});




					}

					results[i].fetchEverything();
				};

				callback(null, results);			
			},

			error: function(error) {
			// error is an instance of Parse.Error.
				callback(new Error('Failed to get coupons'));
			}
		});

	};

	var AcsAddLocation = function(data, callback) {
		
		var point = new Parse.GeoPoint({
			latitude: data.latitude, 
			longitude: data.longitude
		});

		var LocationClass = Parse.Object.extend("Location");
		var location = new LocationClass();

		location.set("name", data.name);
		location.set("address", data.address);
		location.set("location", point);
		location.set("owner", Parse.User.current());


		location.save(null, {
			success: function(location) {
				callback();
			},
			error: function(location, error) {
				alert("Failed to save object.");
			}
		});

	};

	var AcsEditLocation = function(id, data, callback) {
		var query = new Parse.Query("Location");

		query.get(id, {
			success: function(object) {



				var point = new Parse.GeoPoint({
					latitude: data.latitude, 
					longitude: data.longitude
				});

				object.set("name", data.name);
				object.set("address", data.address);
				object.set("location", point);


				object.save(null, {
					success: function(coupon) {
						callback();
					},
					error: function(coupon, error) {
						alert("Failed to save object.");
					}
				});
			},

			error: function(object, error) {
				callback(new Error("Failed to get object"), null);
			}
		});
		
	};

	var AcsRemoveLocation = function(id, callback) {
		return $http.post('api/removelocation.php', {
			id: id
		}).then(function(response) {

			if (response.data.meta.status != "ok") {
				callback(new Error('Failed to remove location'));
			} else {
				callback(null, response.data.response);
			}
		});
	};


	var AcsGetBills = function(callback) {

		var query = new Parse.Query("Bills");
		query.include("user");

		query.equalTo("user", Parse.User.current());
		query.descending("generation");

		query.find({
			success: function(results) {

				callback(null, results);			
			},

			error: function(error) {
				callback(new Error('Failed to get bills'));
			}
		});
	}


/*
 ######   #######  ##     ## ########     ###    ##    ## ##    ## 
##    ## ##     ## ###   ### ##     ##   ## ##   ###   ##  ##  ##  
##       ##     ## #### #### ##     ##  ##   ##  ####  ##   ####   
##       ##     ## ## ### ## ########  ##     ## ## ## ##    ##    
##       ##     ## ##     ## ##        ######### ##  ####    ##    
##    ## ##     ## ##     ## ##        ##     ## ##   ###    ##    
 ######   #######  ##     ## ##        ##     ## ##    ##    ##    
*/


	var AcsGetCompany = function(callback) {
		
		var query = new Parse.Query("Company");
		query.equalTo("merchant", Parse.User.current());
		query.first().then(function(results) {
			callback(null, results);			
		});

	};


	var AcsGetCompanies = function(callback, uiupdater) {
		
		var query = new Parse.Query("Company");
		query.find({
			success: function(results) {

				for (var i = 0; i < results.length; i++) {
					results[i].fetchEverything = function() {
						//return merchant.id;
						var obj = this;
						var merchant = obj.get('merchant');

						obj.numLocations = "Loading...";
						obj.numCoupons = "Loading...";
						obj.numShared = "Loading...";
						obj.numRedeemed = "Loading...";

						// Load locations
						var query1 = new Parse.Query("Location");
						query1.equalTo("owner", merchant);

						query1.count({
							success: function(count) {
								obj.numLocations = count;
								uiupdater();		
							},
							error: function(error) {
								obj.numLocations = "Error";
								uiupdater();
							}
						});



						// Load coupons
						var query2 = new Parse.Query("Coupon");
						query2.equalTo("owner", merchant);

						query2.find({
							success: function(coupons) {
								obj.numCoupons = coupons.length;
								obj.numShared = 0;
								obj.numRedeemed = 0;

								for (var i = 0; i < coupons.length; i++) {
									obj.numShared += coupons[i].get('numShared') || 0;
									obj.numRedeemed += coupons[i].get('numRedeemed') || 0;
								};


								obj.shareRatio = Math.floor(100 * obj.numRedeemed / obj.numShared) + "%";
								uiupdater();		
							},
							error: function(error) {
								obj.numCoupons = "Error";
								uiupdater();
							}
						});




					}

					results[i].fetchEverything();
				};
				callback(null, results);			
			},
			error: function() {
				callback(new Error('Failed to get coupons'));
			}
		});

	};

	var AcsSaveCompanyInfo = function(name, file, callback) {
		var base64 = file;
		var image = new Parse.File("logo.png", { base64: base64 });	
		AcsGetCompany(function(err, company) {
			company.set("name", name);
			company.set("image", image);


			company.save(null, {
				success: function(company) {
					callback();
				},
				error: function(company, error) {
					alert("Failed to save object.");
				}
			});

		});

		
	}

	var AcsRemoveCompanyLogo = function(callback) {

		var query = new Parse.Query("Company");
		query.equalTo("merchant", Parse.User.current());
		query.first().then(function(results) {
			results.unset("image");
			results.save();
			if (callback) callback(null);			
		});

	};



	var AcsGetCompanyStats = function(callback) {
		var query = new Parse.Query("Coupon");
		query.equalTo("owner", Parse.User.current());
		
		query.find({
			success: function(results) {
				var stats = {
					numShares: 0,
					numRedeems: 0
				};

				for (var i = 0; i < results.length; i++) {
					var ns = results[i].get("numShared");
					var nr = results[i].get("numRedeemed");
					ns = ns || "0";
					nr = nr || "0";
					stats.numShares += parseInt(ns, 10);
					stats.numRedeems += parseInt(nr, 10);
				};
				callback(null, stats);			
			},

			error: function(error) {
				callback(new Error('Failed to get coupons'));
			}
		});

	};




	var AcsGetTotalStats = function(callback) {
		var query = new Parse.Query("Coupon");
		
		query.find({
			success: function(results) {
				var stats = {
					numShares: 0,
					numRedeems: 0
				};

				for (var i = 0; i < results.length; i++) {
					var ns = results[i].get("numShared");
					var nr = results[i].get("numRedeemed");
					ns = ns || "0";
					nr = nr || "0";
					stats.numShares += parseInt(ns, 10);
					stats.numRedeems += parseInt(nr, 10);
				};
				callback(null, stats);			
			},

			error: function(error) {
				callback(new Error('Failed to get coupons'));
			}
		});

	};


	var AcsGetMerchantRequests = function(callback) {
		var query = new Parse.Query("MerchantRequests");
		query.include("user");
		
		query.find({
			success: function(results) {
				callback(null, results);			
			},

			error: function(error) {
				callback(new Error('Failed to get merchant requests'));
			}
		});

	};





	var AcsDenyMerchantRequest = function(id, callback) {
		var MerchantRequest = Parse.Object.extend("MerchantRequests");
		var query = new Parse.Query(MerchantRequest);

		query.get(id, {
			success: function(obj) {
				obj.destroy();
				callback();
			},
			error: function(object, error) {
				callback(new Error('Failed to deny merchant request'));
			}
		});
	};

	var AcsAcceptMerchantRequest = function(id, callback) {
		
		var MerchantRequest = Parse.Object.extend("MerchantRequests");
		var query = new Parse.Query(MerchantRequest);

		query.get(id, {
			success: function(obj) {
				obj.set("isAccepted", true);
				obj.save();
				callback();

			},
			error: function(object, error) {
				callback(new Error('Failed to accept merchant request'));
			}
		});
	};


	var AcsGetAllLocations = function(callback, uiupdater) {
		AcsGetLocations(callback, true, uiupdater);
	};

	var AcsGetAllCoupons = function(callback) {
		AcsGetCoupons(callback, true);
	};

	var AcsGetAllPhotopons = function(callback, uiupdater) {
		var query = new Parse.Query("Photopon");

		query.include("creator");
		query.include("coupon");
		query.include("coupon.company");

		query.find({
			success: function(results) {
				for (var i = 0; i < results.length; i++) {
					results[i].fetchEverything = function() {
						var obj = this;
						var users = obj.get("users");

						obj.userList = "Loading...";

						var query2 = new Parse.Query("User");
						console.log(users);
						query2.containedIn("objectId", users);

						query2.find({
							success: function(users) {
								obj.userList = "";
								console.log(users);

								for (var i = 0; i < users.length; i++) {
									obj.userList += users[i].get("username") + ((i == users.length - 1) ? "" : ", ")
								};
								if (uiupdater) uiupdater();		
							},
							error: function(error) {
								obj.userList = "Not Found!";
								if (uiupdater) uiupdater();		
							}
						});




					}

					results[i].fetchEverything();
				};

				callback(null, results);
			}
		});
	};




	return {
		loggedIn: AcsIsLoggedIn,
		login: AcsLogin,
		logout: AcsLogout,
		info: AcsGetInfo,


		
		numAllCoupons: AcsNumAllCoupons,
		getCoupons: AcsGetCoupons,
		getCoupon: AcsGetCoupon,
		addCoupon: AcsAddCoupon,
		editCoupon: AcsEditCoupon,



		getLocations: AcsGetLocations,
		getLocation: AcsGetLocation,
		addLocation: AcsAddLocation,
		editLocation: AcsEditLocation,
		removeLocation: AcsRemoveLocation,



		getCompany: AcsGetCompany,
		getCompanies: AcsGetCompanies,
		removeCompanyLogo: AcsRemoveCompanyLogo,
		saveCompanyInfo: AcsSaveCompanyInfo,
		getCompanyStats: AcsGetCompanyStats,
		getCompanyInvoices: AcsGetBills,



		getTotalStats: AcsGetTotalStats,
		getMerchantRequests: AcsGetMerchantRequests,
		denyMerchantRequest: AcsDenyMerchantRequest,
		acceptMerchantRequest: AcsAcceptMerchantRequest,
		
		getAllLocations: AcsGetAllLocations,
		getAllCoupons: AcsGetAllCoupons,
		getAllPhotopons: AcsGetAllPhotopons

	};
}]);






Parse.Cloud.define("ServerTime", function(request, response) {
	var time = new Date();
	response.success(time.getTime());
});

Parse.Cloud.afterSave("MerchantRequests", function(request) {

	if (request.object.get("isAccepted")) {
		Parse.Cloud.useMasterKey();
		request.object.get("user").set("isMerchant", true);
		request.object.get("user").save();
		request.object.destroy();
	}

});



Parse.Cloud.beforeSave("Verifications", function(request, response) {
	var numTried = request.object.get("numTried") || 0;
	request.object.set("numTried", numTried + 1);


	var client = require('twilio')('AC411575f00f763f4fbaf602173db1c518', '8537400eebcb197b068110ffb552df44');

	
	// Send an SMS message
	client.sendSms({
	    to:'+1' + request.object.get("phoneNumber"),
	    from: '+12015100525',
	    url:'https://demo.twilio.com/welcome/sms/reply/',
	    body: 'Your verification code: ' + request.object.get("code")
	  }, function(err, responseData) {
	    if (err) {
			console.log(err);
	    } else {
			console.log(responseData.from);
			console.log(responseData.body);

    		response.success();
	    }
	  }
	);

    //response.success();
});

Parse.Cloud.beforeSave("Friends", function(request, response) {
	var user1 = request.object.get("user1");
	var user2 = request.object.get("user2");
	var phoneId = request.object.get("phoneId");

	var fship = new Parse.Query("Friends");
	fship.equalTo("user1", user1);

	if (user2) {
		fship.equalTo("user2", user2);
	} else {
		fship.equalTo("phoneId", phoneId);
	}
	
	fship.find({
		success: function(objects) {
			if (objects.length > 0) {
				response.error("Friendship already exists");
			} else {
				response.success();
			}
		},
		error: function(error) {
			response.error(error);
		}
	});

});


Parse.Cloud.beforeSave("Photopon", function(request, response) {

	request.object.set("creator", request.user);
	request.object.set("installationId", request.installationId);
	
    var groupACL = new Parse.ACL();
    groupACL.setPublicReadAccess(true);
    groupACL.setWriteAccess(request.user, true);
    request.object.setACL(groupACL);
 
    response.success();
});


Parse.Cloud.afterSave("Notifications", function(request) {

	var user = request.object.get("to");
	var assocUser = request.object.get("assocUser");
	
	var notificationType = request.object.get("type");
	var channelName = "User_" + user.id;


	assocUser.fetch({
		success: function(assocUser) {
			console.log(assocUser);
			var photoponId;

			var message = "";
			if (notificationType == "PHOTOPON") {

				message = "User " + assocUser.get("username") + " sent you Photopon!"
				photoponId = request.object.get("assocPhotopon").id;

			} else if (notificationType == "MESSAGE") {
				message = assocUser.get("username") + ": " + request.object.get("content");

			} else if (notificationType == "FRIEND") {
				message = assocUser.get("username") + " added you";

			} else if (notificationType == "ADDWALLET") {
				message = assocUser.get("username") + " saved your Photopon";

			} else if (notificationType == "REDEEMED") {
				message = assocUser.get("username") + " redeemed your Photopon";

			}


			Parse.Push.send({
				channels: [ channelName ],
				data: {
					type: notificationType,
					notificationId: request.object.id,
					badge: "Increment",
					alert: message
				}
			}, {
				success: function() {

				},
				error: function(error) {
				// Handle error
				}
			});


		},
		error: function(error) {
		// Handle error
		}
	});

});


Parse.Cloud.job("CreateBills", function(request, response) {
		var WhenBillsGenerated = function(merchantCouponMap) {
			var numMerchants = Object.keys(merchantCouponMap).length;
			response.success("Generated " + numMerchants + " invoices");
		};


		var GetLastBill = function(id, callback) {

			var user = new Parse.User();
			user.id = id;


			var billQuery = new Parse.Query("Bills");
			billQuery.equalTo("user", user);
			billQuery.descending("generation");
			
			billQuery.first({
				success: function(object) {
					callback(object);
				},
				error: function(error) {
					callback(null);
				}
			});


		};


		var GenerateBillForMrechant = function(merchantId, coupons, callback) {
			var BillClass = Parse.Object.extend("Bills");


			GetLastBill(merchantId, function(lastBill) {

				var totalShares = 0;
				var totalRedeems = 0;

				for (var i = 0; i < coupons.length; i++) {
					totalShares += parseInt(coupons[i].get("numShared") || 0, 10);
					totalRedeems += parseInt(coupons[i].get("numRedeemed") || 0, 10);
				};


				var lastTotalShared = parseInt(lastBill ? (lastBill.get("numShared") || 0) : 0, 10);
				var lastTotalRedeemed = parseInt(lastBill ? (lastBill.get("numRedeemed") || 0) : 0, 10);

				var generation = parseInt(lastBill ? lastBill.get("generation") : 0, 10);

				var currentShared = totalShares - lastTotalShared;
				var currentRedeemed = totalRedeems - lastTotalRedeemed;

				var billItems = [];
				billItems.push(currentShared + " coupons shares");
				billItems.push(currentRedeemed + " coupons redeems");

				var price = currentShared * 5 + currentRedeemed * 25;


				var user = new Parse.User();
				user.id = merchantId;
				
				var bill = new BillClass();

				bill.set("numShared", totalShares);
				bill.set("numRedeemed", totalRedeems);
				bill.set("billItems", billItems);
				bill.set("amount", price);
				bill.set("generation", generation + 1);
				bill.set("user", user);



				bill.save(null, {
					success: function(bill) {
						callback();
					},
					error: function(bill, error) {
						throw ("Failed to save object.");
					}
				});
			});


		};

		var WhenCouponsFetched = function(merchantCouponMap) {

			var numMerchantsLeft = Object.keys(merchantCouponMap).length;


			for (var merchantId in merchantCouponMap) {
				GenerateBillForMrechant(merchantId, merchantCouponMap[merchantId], function() {
					numMerchantsLeft--;
					if (numMerchantsLeft == 0) {
						WhenBillsGenerated(merchantCouponMap);
					}
				});
			}

		};


		var GetMerchantCoupons = function() {
			var Company = Parse.Object.extend("Company");

			var queryCompany = new Parse.Query(Company);
			queryCompany.include("merchant");

			queryCompany.find({

				success: function(companies) {
					var merchants = {};

					for (var i = 0; i < companies.length; i++) {
						
						var company = companies[i];
						merchants[company.get("merchant").id] = [];
						var numRequests = companies.length;


						(function(id) {
							
							console.log("Getting " + id);
							
							var user = new Parse.User();
							user.id = id;


							var couponQuery = new Parse.Query("Coupon");
							couponQuery.equalTo("owner", user);
							couponQuery.find({
								success: function(merchantCoupons) {
									numRequests = numRequests - 1;

									for (var j = 0; j < merchantCoupons.length; j++) {
										merchants[id].push(merchantCoupons[j]);
									};

									if (numRequests == 0) {
										WhenCouponsFetched(merchants);
									}

								},
								error: function(error, res) {
									throw error;
								}
							})

						})(company.get("merchant").id);




					}
				
				},
				error: function(error) {
					throw ("Error: " + error.code + " " + error.message);
				}
			});
		};



		try {
			GetMerchantCoupons();
		} catch (ex) {
			response.error(ex);
		}

		


});
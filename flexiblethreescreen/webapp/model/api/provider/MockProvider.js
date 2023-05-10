// @ts-nocheck
/* eslint-disable @sap/ui5-jsdocs/no-jsdoc */
sap.ui.define(["sap/ui/base/Object"], function (UI5Object) {
	"use strict";

	var sMockdataPath = jQuery.sap.getModulePath("com.example.flexibleproject") + "/model/api/mockdata/";

	var aDataSets = [
		"notifications"	,
		"Requests"	
	];

	var oSimulateError = {
		getRequestList: false
	};

	return UI5Object.extend("com.example.flexibleproject.model.api.provider.MockProvider", {
		_iDelay: 1000,
		_oData: {},
		_oInitialDataLoadPromise: {},

		constructor: function () {
            this._sUserName = "DUMMY_USER";
			this._oInitialDataLoadPromise = Promise.all(this._getDataLoadPromises());
		},

		_getDataLoadPromises: function () {
			return aDataSets.map(
				function (sDataSet) {
					return new Promise(
						function (resolve) {
							$.getJSON(
								sMockdataPath + sDataSet + ".json",
								function (oJson) {
									this._oData[sDataSet] = oJson;
									resolve();
								}.bind(this)
							);
						}.bind(this)
					);
				}.bind(this)
			);
		},

		_onDataReady: function () {
			return new Promise(
				function (resolve) {
					this._oInitialDataLoadPromise.then(
						function () {
							setTimeout(
								function () {
									resolve();
								}.bind(this),
								this._iDelay
							);
						}.bind(this)
					);
				}.bind(this)
			);
		},
		getRequestList:function(){
			var aRequestList;
			var oPromise = new Promise(
				function (resolve, reject) {
					this._onDataReady().then(
						function () { 	
								resolve(this._oData.notifications);							
						}.bind(this)
					);
				}.bind(this)
			);
			oPromise.abort = function () {};
			return oPromise;
		},
		// getRequestDetail:function(sEAItemPath, sID){
		// 	var aRequestDetail;
		// 	debugger;
		// 	var oPromise = new Promise(
		// 		function (resolve, reject) {
		// 			this._onDataReady().then(
		// 				function () { 
		// 					debugger;
		// 						// STANDARD EXECUTION
		// 						this._oData.notifications = this._oData.detail.find(
		// 							function (oRequestDetailItem){
		// 								return (
		// 									oRequestDetailItem.NOTIFICATION_ID === sID
		// 								);
		// 							});
		// 						resolve(this._oData.detail);							
		// 				}.bind(this)
		// 			);
		// 		}.bind(this)
		// 	);
		// 	oPromise.abort = function () {};
		// 	return oPromise;
		// }
		getRequestDetail:function(sEAItemPath, sID){
			var aRequestDetail;
			var oPromise = new Promise(
				function (resolve, reject) {
					this._onDataReady().then(
						function () { 
								// STANDARD EXECUTION
								this._oData.RequestDetails = this._oData.RequestDetail.find(
								function (oRequestDetailItem){
									return (
										oRequestDetailItem.RequestID === sID
									);
								});
								resolve(this._oData.RequestDetails.EAFIELDS);							
						}.bind(this)
					);
				}.bind(this)
			);
			oPromise.abort = function () {};
			return oPromise;
		}
    });
});

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/base/util/uid"
], (Controller, MessageBox, util) => {
    "use strict";
    var that, model;
    return Controller.extend("com.hma.hotelmngmnt.controller.View1", {
        onInit() {
            that = this;
            model = that.getOwnerComponent().getModel();
            debugger
            var oUserModel = new sap.ui.model.json.JSONModel();

            // Hit the internal platform mapping shortcut directly via JSONModel
            oUserModel.loadData("/odata/v4/hotel-managemnt-api/getUserInfo()");

            oUserModel.attachRequestCompleted(function () {
                var oData = oUserModel.getData();
                console.log("AppRouter User:", oData.name || oData.email);
            });

            this.getView().setModel(oUserModel, "currentUser");
            // that._currentUserDetails();
            // Create a binding context to read data manually
            var oListBinding = model.bindList("/Guests");

            oListBinding.requestContexts().then(function (aContexts) {
                aContexts.forEach(function (oContext) {
                    debugger
                    // that.getView().setModel(oContext.getObject(),"guest")
                    // console.log(oContext.getObject().title); 
                });
            }).catch(function (oError) {
                console.error("Error reading HANA data via CAPM:", oError);
            });

        },
        _currentUserDetails: function () {
            // var oUserModel = new sap.ui.model.json.JSONModel();
            // oUserModel.loadData("/user-api/currentUser");

            // oUserModel.attachRequestCompleted(function () {
            //     var oData = oUserModel.getData();
            //     console.log("User email: " + oData.email);
            //     console.log("User display name: " + oData.displayName);
            // });

            // that.getView().setModel(oUserModel, "currentUser");
            var oModel = that.getOwnerComponent().getModel(); // Assuming V4 OData Model
            var oOperation = oModel.bindContext("/HotelManagemntAPI.getUserInfo(...)");

            oOperation.execute().then(function () {
                // FIX: Request the object data asynchronously from the V4 context
                oOperation.getBoundContext().requestObject().then(function (oUserData) {
                    console.log("Logged in user ID:", oUserData.id);

                    // Save to your local JSON model for view data-binding
                    var oUserModel = new sap.ui.model.json.JSONModel(oUserData);
                    this.getView().setModel(oUserModel, "currentUser");
                }.bind(this));

            }.bind(this)).catch(function (oError) {
                console.error("Failed to fetch user data: ", oError);
            });

        },
        createGuestList: function () {
            var payload = {
                "ID": "216db7e4-bcc5-4b7b-a279-5d98f9999a17",
                "firstName": "Shreya",
                "lastName": "Kalra",
                "email": "kalraS12@gmail.com",
                "phone": "1234567890",
                "passportOrId": "A8884877",
                "createdAt": "",
                "createdBy": "",
                "modifiedAt": "",
                "modifiedBy": ""
            }
            var oListBinding = model.bindList("/Guests");
            var oContext = oListBinding.create(payload);

            // 5. Submit changes to the CAP backend
            model.submitBatch("hotelUpdateGroup").then(function () {
                debugger
                var aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
                var bHasError = aMessages.some(function (message) {
                    return message.getType() === "Error";
                });

                if (bHasError) {
                    sap.m.MessageBox.error("Data was rejected by the backend. Check network trace.");
                } else {
                    sap.m.MessageToast.show("Data successfully committed to HANA!");
                }
            }, function (oError) {
                sap.m.MessageToast.show("Creation failed.");
            });

        }

    });
});
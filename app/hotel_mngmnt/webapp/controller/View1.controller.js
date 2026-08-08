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
            that._currentUserDetails();
            // Create a binding context to read data manually
            var oListBinding = model.bindList("/Guests");

            oListBinding.requestContexts().then(function (aContexts) {
                aContexts.forEach(function (oContext) {
                    // that.getView().setModel(oContext.getObject(),"guest")
                    // console.log(oContext.getObject().title); 
                });
            }).catch(function (oError) {
                console.error("Error reading HANA data via CAPM:", oError);
            });

        },
        _currentUserDetails: function () {
            var oModel = that.getOwnerComponent().getModel(); // Assuming V4 OData Model
            var oOperation = oModel.bindContext("/getUserInfo(...)");
            oOperation.execute().then(function () {
                // FIX: Request the object data asynchronously from the V4 context
                oOperation.getBoundContext().requestObject().then(function (oUserData) {
                    debugger
                    var oUserModel = new sap.ui.model.json.JSONModel(oUserData);
                    this.getView().setModel(oUserModel, "currentUser");
                }.bind(this));

            }.bind(this)).catch(function (oError) {
                console.error("Failed to fetch user data: ", oError);
            });

        },
        createGuestList: function () {
            var payload = {
                "ID": "",
                "firstName": "Shreya",
                "lastName": "Kalra",
                "email": "kalraS12@gmail.com",
                "phone": "1234567890",
                "passportOrId": "A8884877",
                "createdBy": that.getView().getModel("currentUser").getData().id,
                "modifiedBy": that.getView().getModel("currentUser").getData().id
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
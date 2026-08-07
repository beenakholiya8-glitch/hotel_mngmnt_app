sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/base/util/uid"
], (Controller, MessageBox,util) => {
    "use strict";
    var that, model;
    return Controller.extend("com.hma.hotelmngmnt.controller.View1", {
        onInit() {
            that = this;
            model = that.getOwnerComponent().getModel();
          
        },
        createGuestList: function () {
            var payload = {
                "ID" : "216db7e4-bcc5-4b7b-a279-5d98f9999a14",
                "firstName": "Vandana",
                "lastName": "Merva",
                "email": "vandanam@gmail.com",
                "phone": "8876543212",
                "passportOrId": "A1234875",
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
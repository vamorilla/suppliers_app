sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/bootcamp/sapui5/suppliersapp/model/models",
     "com/bootcamp/sapui5/suppliersapp/utils/SuppliersHelper"
], (UIComponent, models, SuppliersHelper) => {
    "use strict";

    return UIComponent.extend("com.bootcamp.sapui5.suppliersapp.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            this.setInitModel(); 
        },

        setInitModel: function () {
            SuppliersHelper.init(this.getModel());
            SuppliersHelper.setInitLocalDataModel(this);
            SuppliersHelper.setEmptyProductModel(this);
        } 
    });
});
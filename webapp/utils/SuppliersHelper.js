sap.ui.define([
	"com/bootcamp/sapui5/suppliersapp/utils/SuppliersService",
	"sap/ui/model/json/JSONModel"
], function (SuppliersService, JSONModel) {
	"use strict";

	return {
		init: function (oNorthwindModel) {
			this._oNorthwindModel = oNorthwindModel;


		},

        setInitLocalDataModel: function (oComponent) {
            oComponent.setModel(new JSONModel({
                idInputValue: '',
                nameInputValue: ''
            }), "LocalDataModel");
        },


		getDataSuppliers: async function(aFilters) {
            return SuppliersService.getSuppliers(this._oNorthwindModel, aFilters);
        },

        setSuppliersModel: async function (oController, oDatos) {
            let oListModel = oController.getOwnerComponent().getModel('SupplierCollection');
            if(!oListModel){
                const oModel  = new JSONModel([]);
                oModel.setSizeLimit(1000000);	
                oController.getOwnerComponent().setModel(oModel, "SupplierCollection");  
                oListModel = oController.getOwnerComponent().getModel('SupplierCollection');
            }

            oListModel.setData(oDatos);
        },
	};
});
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

        setEmptyProductModel: function (oComponent) {
            oComponent.setModel(new JSONModel({
                ProductName: "",
                UnitPrice: "",
                UnitsInStock: "",
                CategoryID: "",
                SupplierID: ""
            }), "ProductModel")
        },

        createProductModelFromExisting: function (oProduct) {
            return new JSONModel(Object.assign({}, oProduct));
        },

        // Local model to simulate product additions,
        // as OData navigation properties like /Products
        // can't be modified directly (e.g., with .push())
        setSimulatedProductsModel: function (oComponent, aProducts) {
            const oModel = new JSONModel(aProducts || []);
            oComponent.setModel(oModel, "SimulatedProductsModel");
        }
	};
});
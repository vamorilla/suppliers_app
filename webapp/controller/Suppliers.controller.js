sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Sorter",
    "sap/ui/core/library",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
], (Controller, Sorter, CoreLibrary, FilterOperator, Filter ) => {
    "use strict";

    const SortOrder = CoreLibrary.SortOrder;

    return Controller.extend("com.bootcamp.sapui5.suppliersapp.controller.Suppliers", {
        onInit() {
        },

        clearAllSortings: function() {
			const oTable = this.byId("table");
			oTable.getBinding().sort(null);
			this._resetSortingState();
		},

        _resetSortingState: function() {
			const oTable = this.byId("table");
			const aColumns = oTable.getColumns();
			for (let i = 0; i < aColumns.length; i++) {
				aColumns[i].setSortOrder(SortOrder.None);
			}
		},

        onSearchSuppliers: async function (oEvent) {
            let aFilter = [];

            let oTable = this.getView().byId("table");
            let oBinding = oTable.getBinding();

            let values = this.getOwnerComponent().getModel("LocalDataModel").getData();
           
            if(values.idInputValue){
                aFilter.push(new Filter("SupplierID", FilterOperator.EQ, values.idInputValue));
            }          

            if(values.nameInputValue){
                aFilter.push(new Filter("CompanyName", FilterOperator.Contains, values.nameInputValue));
            }                     
           
            oBinding.filter(aFilter);
        },

        onClearFilters: function () {
            const oModel = this.getOwnerComponent().getModel("LocalDataModel");
        
            // Limpiar valores
            oModel.setProperty("/idInputValue", "");
            oModel.setProperty("/nameInputValue", "");
        
            const oTable = this.byId("table");
            const oBinding = oTable.getBinding();
            oBinding.filter([]);
        },
    });
});
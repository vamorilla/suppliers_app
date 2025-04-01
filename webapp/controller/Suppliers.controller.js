sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/library",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
], (Controller, CoreLibrary, FilterOperator, Filter ) => {
    "use strict";

    const SortOrder = CoreLibrary.SortOrder;

    return Controller.extend("com.bootcamp.sapui5.suppliersapp.controller.Suppliers", {
        onInit() {
            this.oRouter = this.getOwnerComponent().getRouter();
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

        onSearchSuppliers: async function () {
            let aFilter = [];

            let oTable = this.getView().byId("table");
            let oBinding = oTable.getBinding();

            let sSearchValue  = this.getOwnerComponent().getModel("LocalDataModel").getProperty("/searchValue");

            //If the input is numeric, filter by SupplierID and CompanyName
            if (!isNaN(sSearchValue)) {
                aFilter.push(new Filter("SupplierID", FilterOperator.EQ, sSearchValue));
            }
            //Always filter by text
            aFilter.push(new Filter("CompanyName", FilterOperator.Contains, sSearchValue));

            const oFilter = new Filter({
                filters: aFilter,
                and: false
            });
        
            oBinding.filter([oFilter]);
        },

        onClearFilters: function () {
            const oModel = this.getOwnerComponent().getModel("LocalDataModel");
        
            // Clear searchValue
            oModel.setProperty("/searchValue", "");
        
            const oTable = this.byId("table");
            const oBinding = oTable.getBinding();
            oBinding.filter([]);
        },

        onRowSelected: function (oEvent) {
            const oTable = this.byId("table");
            const iIndex = oEvent.getParameter("rowIndex");

            const oContext = oTable.getContextByIndex(iIndex);

            if (oContext) {
                const oSupplier = oContext.getObject();
        
                this.oRouter.navTo("detail", {
                    SupplierID: oSupplier.SupplierID
                });
            }
        }
    });
});
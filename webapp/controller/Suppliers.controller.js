sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Sorter",
    "sap/ui/core/library"
], (Controller, Sorter, CoreLibrary) => {
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
		}
    });
});
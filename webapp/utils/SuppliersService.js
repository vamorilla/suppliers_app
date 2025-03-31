sap.ui.define([
], function () {
    "use strict";

    return {
        getSuppliers: async function (oModel, aFilter) {
            const aRequestsPromises = [
                new Promise(function (resolve, reject) {
                    oModel.read('/Suppliers', {
                        filters: aFilter,
                        success: resolve,
                        error: reject,
                    })
                }.bind(this))
            ];

            return Promise.all(aRequestsPromises);
        },
    }
});
sap.ui.define([], function () {
    "use strict";
    return {
        getStateStock(value) {
            if (value > 0) {
                return 'Success';
            } else {
                return 'Error';
            }

        }
    }
});
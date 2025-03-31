sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "com/bootcamp/sapui5/suppliersapp/utils/SuppliersHelper"
], (Controller, JSONModel, Fragment, SuppliersHelper) => {
    "use strict";

    return Controller.extend("com.bootcamp.sapui5.suppliersapp.controller.Detail", {
        onInit() {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            let sSupplierID = oEvent.getParameter("arguments").SupplierID;

            this.getView().bindElement({
                path: "/Suppliers(" + sSupplierID + ")",
                parameters: {
                    expand: "Products,Products/Category"
                }
            });
        },

        onAddProduct: function () {
            const oComponent = this.getOwnerComponent();
            SuppliersHelper.setEmptyProductModel(oComponent);
            this._openProductDialog(true);
        },

        onProductPress: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oContext = oItem.getBindingContext();
            const oProduct = oContext.getObject();
          
            const oProductModel = SuppliersHelper.createProductModelFromExisting(oProduct);
            this.getOwnerComponent().setModel(oProductModel, "ProductModel");
            this._openProductDialog(false);
        },

        _openProductDialog: async function (isCreating) {
            const oView = this.getView();

            oView.setModel(new JSONModel({ isCreating }), "viewFlags");

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    name: "com.bootcamp.sapui5.suppliersapp.view.fragments.ProductFormDialog",
                    controller: this
                }).then(oDialog => {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            const oDialogInstance = await this._pDialog;
            oDialogInstance.open();
        },

        onCreateProduct: async function () {
            const oProduct = this.getView().getModel("ProductModel").getData();

            const oBinding = this.byId("productsTable").getBinding("items");
            const aProducts = oBinding.getModel().getProperty(oBinding.getPath());

            const isCreating = this.getView().getModel("viewFlags").getProperty("/isCreating");

            if (isCreating) {
                aProducts.push(oProduct);
                oBinding.getModel().refresh();
            }

            const oDialog = await this._pDialog;
            oDialog.close();
        },

        onCloseDialog: async function () {
            const oDialog = await this._pDialog;
            oDialog.close();
        }
    });
});
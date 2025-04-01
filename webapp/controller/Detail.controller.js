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

            const oModel = this.getView().getModel();
           //TODO: Research to include the categoryName in the model
            oModel.read(`/Suppliers(${sSupplierID})/Products`, {
                success: (oData) => {
                    SuppliersHelper.setSimulatedProductsModel(this.getOwnerComponent(), oData.results);
                },
                error: () => {
                    SuppliersHelper.setSimulatedProductsModel(this.getOwnerComponent(), []);
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
            const oContext = oItem.getBindingContext("SimulatedProductsModel");
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
            const oProductModel = this.getView().getModel("ProductModel");
            const oProduct = oProductModel.getData();
            let bIsValid= true;

            const aFieldsToValidate = [
                { path: "/ProductName", statePath: "/ProductNameState" },
                { path: "/UnitPrice", statePath: "/UnitPriceState" },
                { path: "/QuantityPerUnit", statePath: "/UnitsInStockState" },
                { path: "/CategoryID", statePath: "/CategoryIDState" }
            ];

            aFieldsToValidate.forEach(field => {
                const value = oProductModel.getProperty(field.path);
            
                if (!value) {
                    oProductModel.setProperty(field.statePath, "Error");
                    bIsValid = false;
                } else {
                    oProductModel.setProperty(field.statePath, "None");
                }
            });

            if (!bIsValid) {
                sap.m.MessageToast.show("Please fill all required fields.");
                return;
            }

            const oModel = this.getView().getModel("SimulatedProductsModel");
            const aProducts = oModel.getData(); 

            const isCreating = this.getView().getModel("viewFlags").getProperty("/isCreating");

            if (isCreating) {
                aProducts.push(oProduct);
                oModel.refresh();
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
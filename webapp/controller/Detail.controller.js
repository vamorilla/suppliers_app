sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "com/bootcamp/sapui5/suppliersapp/utils/SuppliersHelper",
    "sap/m/MessageBox",
    "com/bootcamp/sapui5/suppliersapp/model/formatter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/m/Token"
], (Controller, JSONModel, Fragment, SuppliersHelper, MessageBox, formatter, FilterOperator, Filter, Token) => {
    "use strict";

    return Controller.extend("com.bootcamp.sapui5.suppliersapp.controller.Detail", {
        formatter: formatter,
        
        onInit() {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
        },
        
        //_ is a suggested syntactical convention for private controller functions
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
            console.log(oProduct)
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
                { path: "/UnitsInStock", statePath: "/UnitsInStockState" },
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

                this.onClearPruductFilters();
            }

            const oDialog = await this._pDialog;
            oDialog.close();
        },

        onDeleteProduct: function (oEvent) {
            const iIndex = this._getProductIndexFromEvent(oEvent);
        
            if (iIndex === null) return;
        
            this._confirmAndDeleteProduct(iIndex);
        },

        _getProductIndexFromEvent: function (oEvent) {
            const oButton = oEvent.getSource();
            const oContext = oButton.getBindingContext("SimulatedProductsModel");
        
            if (!oContext) return null;
        
            const sPath = oContext.getPath();
            // Removes the slash and converts the path to a number
            const iIndex = parseInt(sPath.replace("/", ""), 10);
        
            return isNaN(iIndex) ? null : iIndex;
        },

        _confirmAndDeleteProduct: function (iIndex) {
            const oModel = this.getView().getModel("SimulatedProductsModel");
            const aData = oModel.getData();
        
            MessageBox.confirm("Are you sure you want to delete this product?", {
                title: "Confirm Deletion",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        aData.splice(iIndex, 1);
                        oModel.refresh();
                        MessageToast.show("Product deleted");
                    }
                }
            });
        },

        onCloseDialog: async function () {
            const oDialog = await this._pDialog;
            oDialog.close();
        },

        onSearchProduct: function () {
            const oMultiInput = this.byId("categoryId");
            const aTokens = oMultiInput.getTokens();
        
            const aCategoryIDs = aTokens.map(token => token.getKey());
        
            const oBinding = this.byId("productsTable").getBinding("items");

            const aFilters = [];
            aCategoryIDs.forEach(id => {
                aFilters.push(new Filter("CategoryID", FilterOperator.EQ, id));
            });
            
            const oFilter = new Filter({
                filters: aFilters,
                and: false 
            });
            
            oBinding.filter([oFilter]);
        },
        
        onClearPruductFilters: function () {
            const oMultiInput = this.byId("categoryId");
            oMultiInput.removeAllTokens();
        
            this.byId("productsTable").getBinding("items").filter([]);
        },

        _addCategoryToken: function (oCategory) {
            const oMultiInput = this.byId("categoryId");
        
            // Avoid duplicate tokens
            const aTokens = oMultiInput.getTokens();
            const bExists = aTokens.some(token => token.getKey() === oCategory.CategoryID.toString());
            if (bExists) return;
        
            oMultiInput.addToken(new Token({
                key: oCategory.CategoryID,
                text: `${oCategory.CategoryID} - ${oCategory.CategoryName}`
            }));
        },

        onCategorySuggestionSelected: function (oEvent) {
            const oItem = oEvent.getParameter("selectedItem");
            
            const oCategory = {
                CategoryID: oItem.getKey(),
                //Only save the CategoryName
                CategoryName: oItem.getText().split(" - ")[1]
            };
        
            this._addCategoryToken(oCategory);
        },
    });
});
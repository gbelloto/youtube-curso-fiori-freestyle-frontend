sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zov.controller.View1",{
            onInit: function(){
                
                // model padrao da view
                /*var oView = this.getView();
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({"usuario": {"nome": "Gustavo Belloto"}});
                oView.setModel(oModel);*/


                //Data biding
                var oView = this.getView();

                var oModel1 = new sap.ui.model.json.JSONModel();
                oModel1.setData({"usuario": {"nome": "Gustavo"}});
                oModel1.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
                oView.setModel(oModel1, "oneway");

                var oModel2 = new sap.ui.model.json.JSONModel();
                oModel2.setData({"usuario": {"nome": "Gustavo"}});
                oModel2.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                oView.setModel(oModel2, "twoway");

                var oModel3 = new sap.ui.model.json.JSONModel();
                oModel3.setData({"usuario": {"nome": "Gustavo"}});
                oModel3.setDefaultBindingMode(sap.ui.model.BindingMode.OneTime);
                oView.setModel(oModel3, "onetime");

                // model com o nome "dados"
                var oView = this.getView();
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({"usuario": {"nome": "Carol Fuentes"}});
                oView.setModel(oModel, "dados");
            },

            onTestOneWay: function(){
                var oView = this.getView();

                var oModel = oView.getModel("oneway");
                var oData = oModel.getData();
                oData.usuario.nome += ".";
                oModel.setData(oData);
            },
            onTestTwoWay: function(){
                var oView = this.getView();

                var oModel = oView.getModel("twoway");
                var oData = oModel.getData();
                oData.usuario.nome += ".";
                oModel.setData(oData);
            },

            onTestOneTime: function(){
                var oView = this.getView();

                var oModel = oView.getModel("onetime");
                var oData = oModel.getData();
                oData.usuario.nome += ".";
                oModel.setData(oData);
            },

            onTestModels: function(){

            // model usuarios
            var oModel = this.getOwnerComponent().getModel("usuarios");
            var oData = oModel.getData();
            console.log("Model dos usuarios");
            console.log(oData);

            console.log("-------------------------------");

            // model do servico
            var oModel = this.getOwnerComponent().getModel();
                oModel.read("/OVCabSet",{
                    success: function(oData, oResponse){
                        console.log("Dados retornados do servico");
                        console.log(oData);
                        console.log(oResponse);
                    },
                    error: function(oError){
                        console.log(oError);    
                    }
                }
            )
            }
        });
    });
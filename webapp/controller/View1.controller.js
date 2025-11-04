sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, formatter) {
        "use strict";

        return Controller.extend("zovgrp.controller.View1",{

           
            onInit: function(){
              
            },

            onRequisicaoNormal(){
                this.executeRequests(false);
            },

            onRequisicaoBatch(){
                this.executeRequests(false);
            },

            executeRequests(bUseBatch){

                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(bUseBatch);

                console.log("Executando requisições");
                console.log("---------------------------------");

                // Requisição 1
                oModel.read("/OVCabSet(2)",{
                   success: function(oData2, oResponse){
                        console.log("Leitura chave 2: Ok");
                   },
                   error: function(oError){
                        console.log("Leitura chave 2: erro");
                        console.log(oError);
                   }
                });

                // Requisição 2
                oModel.read("/OVCabSet(3)",{
                   success: function(oData2, oResponse){
                        console.log("Leitura chave 3: Ok");
                   },
                   error: function(oError){
                        console.log("Leitura chave 3: erro");
                        console.log(oError);
                   }
                });            

                // Requisição 3
                oModel.read("/OVCabSet(5)",{
                   success: function(oData2, oResponse){
                        console.log("Leitura chave 5: Ok");
                   },
                   error: function(oError){
                        console.log("Leitura chave 5: erro");
                        console.log(oError);
                   }
                });  

            }

        });
    });
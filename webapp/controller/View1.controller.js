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

            onTestCallback: function(){
                console.log("[Processo 1] Início");
                this.onConsultaOrdem(2, function(oData, oResponse){
                    console.log("[Processo 2] Terminou consulta");
                    console.log(oData);
                    console.log(oResponse);
                });
                console.log("[Processo 1] Fim");
            },

            onConsultaOrdem: function(iId, callback){
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);
                oModel.read("/OVCabSet("+iId+")",{
                    success: function(oData2, oResponse){
                        callback(oData2. oResponse);    
                    },
                    error: function(oError){

                    }
                    }
                );
            },
            onTestPromise1: function(){
                console.log("[Processo 1] Início");
                var oPromise1 = this.onConsultaOrdem2(2);
                oPromise1.then(function(oData, oResponse){
                    console.log("[Processo 2] Terminou");
                    console.log(oData);
                    console.log(oResponse);
                });
                console.log("[Processo 1] Fim");
            },

            onTestPromise2: function(){
                console.log("[Processo 1] Início");
                
                var oPromise1 = this.onConsultaOrdem2(3);  
                oPromise1.then(function(oData, oResponse){
                    console.log("[Processo 2] Terminou");
                });

                var oPromise2 = this.onConsultaOrdem2(5);  
                oPromise2.then(function(oData, oResponse){
                    console.log("[Processo 3] Terminou");
                });
                
                var oPromise3 = this.onConsultaOrdem2(6);  
                oPromise3.then(function(oData, oResponse){
                    console.log("[Processo 4] Terminou");
                });

                Promise.all([oPromise1, oPromise2]).then(function(aRetorno){
                    console.log("[Processo 5] Promise.all terminou");
                    console.log(aRetorno);                    
                });

                console.log("[Processo 1] Fim");

            },

            onConsultaOrdem2: function(iId){
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);

                return new Promise(function(resolve, reject){
                    oModel.read("/OVCabSet("+iId+")",{
                        success: function(oData2, oResponse){
                            resolve({oData: oData2, oResponse: oResponse});
                        },

                        error: function(oError){
                            reject({oError:oError});
                        }
                    })
                })

            }

        });
    });
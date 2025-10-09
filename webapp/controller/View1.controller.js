sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("zov.controller.View1",{
            onInit: function(){
            },

            onCreateOVCab: function(){
                var oData = {
                    ClienteId: 1,
                    TotalItens: "140.00",
                    TotalFrete: "20.00",
                    TotalOrdem: "160.00",
                    Status: 'N'
                };
                this.create(oData);
            },

            onCreateDeepOVCab: function(){
                var oData = {
                    ClienteId: 1,
                    TotalItens: "140.00",
                    TotalFrete: "20.00",
                    TotalOrdem: "160.00",
                    Status: 'N',
                    toOVItem: [
                        {
                            "ItemId": 1,
                            "Material": "100",
                            "Descricao": "Mouse",
                            "Quantidade": 1,
                            "PrecoUni": "1.00",
                            "PrecoTot": "1.00",
                        },
                        {
                            "ItemId": 2,
                            "Material": "200",
                            "Descricao": "Teclado",
                            "Quantidade": 2,
                            "PrecoUni": "10.00",
                            "PrecoTot": "20.00",
                        }
                    ]
                };
                this.create(oData);
            },

            onReadOVCab: function(){
                var iOrdemId = this.getView().byId("lastOrdemId").getValue();
                if(iOrdemId == "0"){
                    MessageToast.show("Campo ID da Ordem vazio");
                    return;
                }

                this.read(iOrdemId);
            },

            onUpdateOVCab: function(){
                var iOrdemId = this.getView().byId("lastOrdemId").getValue();
                if(iOrdemId == "0"){
                    MessageToast.show("Campo ID da Ordem vazio");
                    return;
                }

                var oData = {
                    ClienteId: 2,
                    TotalItens: '150.00',
                    TotalFrete: '10.00',
                    TotalOrdem: '100.00',
                    Status: 'C'
                };
                this.update(iOrdemId, oData);
            },

            update: function(iOrdemId, oData){

                var that = this;
                var oModel = this.getOwnerComponent().getModel();  
                this.getView().setBusy(true);

                
                oModel.update("/OVCabSet("+iOrdemId+")",oData,{
                    success: function(oData2, oResponse){
                        that.getView().setBusy(false);
                        console.log(oData2);
                        console.log(oResponse);
                        if(oResponse.statusCode == 204){
                            MessageToast.show("atualizado com sucesso");
                        }else{
                            MessageToast.show("erro na atualização");
                        }
                    },
                    error: function(oError){
                        that.getView().setBusy(false);

                        console.log(oError);
                        var oObj = JSON.parse(oError, responseText);
                        MessageToast.show(oObj.error.message.value);
                    }}
                );
            },

            onDeleteOVCab: function(){
                var iOrdemId = this.getView().byId("lastOrdemId").getValue();
                this.delete(iOrdemId);
            },

            delete: function(iOrdemId){

                var that = this;
                var oModel = this.getOwnerComponent().getModel();

                this.getView().setBusy(true);
                oModel.remove("/OVCabSet("+iOrdemId+")",{
                    success: function(oData2, oResponse){
                        that.getView().setBusy(false);

                        console.log(oData2);
                        console.log(oResponse);
                        if(oResponse.statusCode == 204){
                            MessageToast.show("Deletado com sucesso");
                        }else{
                            MessageToast.show("Erro ao deletar")
                        }
                    },
                    error: function(oError){
                        that.getView().setBusy(false);
                        console.log(oError);
                        alert(iOrdemId);
                        var oObj = JSON.parse(oError.responseText);
                        MessageToast.show(oObj.error.message.value);
                    }
                })

            },

            create: function(oData){
                var that = this;
                var oModel = this.getOwnerComponent().getModel();

                this.getView().setBusy(true);
                oModel.create("/OVCabSet", oData, {
                    success: function(oData2, oResponse){
                        that.getView().setBusy(false);

                        console.log(oData2);
                        console.log(oResponse);
                        if(oResponse.statusCode == 201){
                            that.getView().byId("lastOrdemId").setValue(oData2.OrdemId);
                            that.getView().byId("textarea1").setValue(JSON.stringify(oData2));
                            MessageToast.show("Cadastrado com sucesso");
                        }else{
                            MessageToast.show("Erro no cadastro");
                        }
                    }
                }
                )
            },

            read: function(iOrdemId){
                var that = this;
                var oModel = this.getOwnerComponent().getModel();

                this.getView().setBusy(true);
                oModel.read("/OVCabSet("+iOrdemId+")",{
                    success: function(oData2, oResponse){
                        that.getView().setBusy(false);

                        that.getView().byId("textarea1").setValue(JSON.stringify(oData2));

                        console.log(oData2);
                        console.log(oResponse);
                        MessageToast.show("leitura realizada");
                    },
                    error: function(oError){
                        that.getView().setBusy(false);

                        console.log(oError);
                        var oObj = JSON.parse(oError.reponseText);
                        MessageToast.show(oObj.message.value);
                    }
                });

            }
        });
    });
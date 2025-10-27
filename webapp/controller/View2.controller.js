sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("zov.controller.View2",{
            onInit: function(){

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteView2").attachMatched(this._onRouteMatchedView2, this);
                var oView = this.getView();
                var oFModel = new sap.ui.model.json.JSONModel();

                oFModel.setData({
                    "OrdemId": "",
                    "DataCriacao": "",
                    "CriadoPor": "",
                    "ClienteId": "",
                    "TotalItens": "",
                    "TotalFrete": "",
                    "TotalOrdem": "",
                    "Status": "",
                    "OrdenacaoCampo": "OrdemId",
                    "OrdenacaoTipo": "ASC",
                    "Limite": 5,
                    "Offset": 0
                });
                oView.setModel(oFModel, "filter");

                var oTModel = new sap.ui.model.json.JSONModel();
                oTModel.setData([]);
                oView.setModel(oTModel, "table")
                this.onFilterSearch();
            },
            

            onAtualizarStatus: function(sStatus){
                
                var oTable = this.getView().byId("table2");
                var oModel = this.getOwnerComponent().getModel();
                var aIndex = oTable.getSelectedIndices();
                var that = this;
                var vMsg = "";
                
                if(aIndex.length == 0){
                    MessageToast.show("Selecionar uma linha");
                    return;
                }

                var vAtual = 0;
                var vMax = 0;

                vMax = aIndex.length;

                this.getView().setBusy(true);
                while(vAtual < vMax ){
                    var oItem = oTable.getContextByIndex(aIndex[vAtual]);
                    var iOrdemId = oItem.getProperty("OrdemId");

                    //alert(iOrdemId);
                    oModel.callFunction(
                    "/zfi_atualiza_status",
                    {
                        method: "GET",
                        urlParameters: {
                          ID_ORDEMID: iOrdemId,
                          ID_STATUS: sStatus      
                        },
                        success: function(oData, response){
                            //vMsg = vMsg + "Status atualizado da ordem "+ iOrdemId;
                            //alert(vMsg);
                            //MessageToast.show("Status atualizado da ordem "+iOrdemId);
                            that.onFilterSearch();
                        },

                        error: function(oError){
                            //vMsg = vMsg + "Erro ao atualizar status da ordem "+iOrdemId;
                            //alert(vMsg);
                            //MessageToast.show("Erro ao atualizar status da ordem "+iOrdemId);
                        }
                        
                    }

                )
                vMsg = vMsg + "/Status atualizado da ordem "+ iOrdemId;
                vAtual = vAtual + 1;
                }

                MessageToast.show(vMsg);
                that.onFilterSearch();    
                that.getView().setBusy(false);

/*
                var oItem = oTable.getContextByIndex(aIndex[0]);
                var iOrdemId = oItem.getProperty("OrdemId");
                
                
                //this.getView().setBusy(true);
                oModel.callFunction(
                    "/zfi_atualiza_status",
                    {
                        method: "GET",
                        urlParameters: {
                          ID_ORDEMID: iOrdemId,
                          ID_STATUS: sStatus      
                        },
                        success: function(oData, response){
                            that.getView().setBusy(false);
                            MessageToast.show("Status atualizado com sucesso");
                            that.onFilterSearch();    
                        },

                        error: function(oError){
                            that.getView().setBusy(false);
                            MessageToast.show("Erro ao atualizar status");
                        }

                    }

                )*/


            },

            _onRouteMatchedView2: function(oEvent){
                //alert("Modo criação do cliente");
            },

            onFilterReset: function(){
                var oView = this.getView();
                var oFModel = oView.getModel("filter");
                var oFData = oFModel.getData();
                                oFModel.setData({
                    "OrdemId": "",
                    "DataCriacao": "",
                    "CriadoPor": "",
                    "ClienteId": "",
                    "TotalItens": "",
                    "TotalFrete": "",
                    "TotalOrdem": "",
                    "Status": "",
                    "OrdenacaoCampo": "",
                    "OrdenacaoTipo": ""
                });
            },

            onFilterSearch: function(){
                var oView = this.getView();
                var oModel = this.getOwnerComponent().getModel();
                var oFModel = oView.getModel("filter");
                var oTModel = oView.getModel("table");
                var oFData = oFModel.getData();
                var oFilter = null;
                var aParams = [];
                var that = this;
                
                // aplicando filtros
                var aSorter = [];
                var aFilters = [];

                if(oFData.OrdemId != ''){
                    oFilter = new sap.ui.model.Filter({
                        path: 'OrdemId',
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oFData.OrdemId
                    });
                    aFilters.push(oFilter);
                }

                if(oFData.DataCriacao != ''){
                    oFilter = new sap.ui.model.Filter({
                        path: 'DataCriacao',
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oFData.DataCriacao
                    });
                    aFilters.push(oFilter);
                }

                if(oFData.ClienteId != ''){
                    oFilter = new sap.ui.model.Filter({
                        path: 'ClienteId',
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oFData.ClienteId
                    });
                    aFilters.push(oFilter);
                }

                var bDescending = false;
                if(oFData.OrdenacaoTipo == "DESC"){
                    bDescending = true;
                }

                var oSort = new sap.ui.model.Sorter(oFData.OrdenacaoCampo, bDescending);
                aSorter.push(oSort);

                // limite, offset
                aParams.push("$top="+oFData.Limite);
                aParams.push("$skip="+oFData.Offset);

                // executando o filtro
                this.getView().setBusy(true);
                oModel.read("/OVCabSet",{
                    sorters: aSorter,
                    filters: aFilters,
                    urlParameters: aParams,

                    success: function(oData2, oResponse){
                        that.getView().setBusy(false);
                        oTModel.setData(oData2.results);
                    },
                    error: function (oError){
                        that.getView().setBusy(false);
                        MessageToast.show("erro");
                    }
                }

                )
            }

/*            onCreateOVCab: function(){
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

            }*/
        });
    });
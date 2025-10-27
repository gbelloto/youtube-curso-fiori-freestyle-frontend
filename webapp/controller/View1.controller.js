sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, formatter) {
        "use strict";

        return Controller.extend("zov.controller.View1",{

            formatter: formatter,

            onInit: function(){
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
                    "OrdenacaoTipo": "ASC"
                });
                oView.setModel(oFModel, "filter");
                this.onFilterSearch();

                var oDModel = new sap.ui.model.json.JSONModel();
                oDModel.setData({
                    "DataCriacao": new Date(),
                    "Preco": 1500.23,
                    "Status": "N",
                    "Moeda": "BRL",
                    "CPF": "12345678910"
                }
                );
                oView.setModel(oDModel, "dados");
            },

            onChangePrice: function(oEvent){
                var _oInput = oEvent.getSource();
                var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');

                if(val == ""){
                    _oInput.setValue(val);
                    return;
                }

                //removendo zero a esquerda
                val = val.replace(/^0+/, '');

                var length = val.length;
                if(length == 1){
                    val = "0,0"+val;
                }else if( length == 2){
                    val = "0,"+val;
                }else if(length > 2){
                    val = val.slice(0,length-2)+"."+val.slice(-2);
                    val = formatter.formatPrice(val);
                }else{
                    val = "";
                }
                _oInput.setValue(val);
            },
            
            onView2: function(){
                var r = sap.ui.core.UIComponent.getRouterFor(this);
                r.navTo("RouteView2");
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
                var oTable = oView.byId("table1");
                var oFModel = oView.getModel("filter");
                var oFData = oFModel.getData();
                var oFilter = null;
                var aParams = [];

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

                // executando o filtro
                oTable.bindRows({
                    path: '/OVCabSet',
                    sorter: aSorter,
                    filters: aFilters
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
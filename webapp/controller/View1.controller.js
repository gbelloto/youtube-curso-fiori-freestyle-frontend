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

            onOpenDialogInfo: function(){
                var that = this;
                var sName = "zovgrp.view.DialogInfo";

                if(!this.oDialog){
                    this.loadFragment({
                        name: sName
                    }).then(function(oDialog2){
                        that.oDialog = oDialog2;
                        that.oDialog.open();
                    }.bind(this));
            }else{
                this.oDialog.open();
            }

        },

        onCloseDialogInfo: function(){
            this.byId("DialogInfo").close();
        }
    
        });
    });
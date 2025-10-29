sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, formatter) {
        "use strict";

        return Controller.extend("zov_grp.controller.Footer",{

           
            onInit: function(){
              
            },

            onFooter: function(){
                alert("onFooter");
            }

        });
    });
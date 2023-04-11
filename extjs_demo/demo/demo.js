/**
 * @package  PacBundle
 *
 * @author   Bhavika Matariya
 */

pimcore.registerNS("pimcore.plugin.demo");

pimcore.plugin.demo = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.demo";
    },

    initialize: function () {
        pimcore.plugin.broker.registerPlugin(this);
    },
    pimcoreReady: function (params, broker) {
        var that = this;

        this.navEl = Ext.get("pimcore_menu_file").insertSibling(
            '<li id="pimcore_menu_demoButton" data-menu-tooltip="All Actions" class="pimcore_menu_item pimcore_menu_needs_children"><img src="/bundles/pimcoreadmin/img/flat-white-icons/globe.svg" style="width: 20px"></li>',
            "before"
        );
        this.menu = new Ext.menu.Menu({
            items: [
                {
                    text: "DemoTab",
                    iconCls: "pimcore_nav_icon_import",
                    handler: function () {
                        that.menuHandler();
                    },
                },
            ],
        });

        pimcore.layout.toolbar.prototype.demoButton = this.menu;
        var toolbar = pimcore.globalmanager.get("layout_toolbar");
        this.navEl.on(
            "mousedown",
            toolbar.showSubMenu.bind(toolbar.demoButton)
        );
        pimcore.plugin.broker.fireEvent("mdsMenuReady", toolbar.demoButton);
    },

    postOpenObject: function (object, type) {        
        if(object.data.general.o_className == 'OnlineShopOrder'){            
            for (var i = 0; i < object.data.data.priceModifications.length; i++) {
                console.log(object.data.data.priceModifications[i].data);
            }
        }
        if (object.data.general.o_className == 'Car' && object.data.data.objectType == "actual-car") {
            object.toolbar.add({
                text: t('print-pdf'),
                iconCls: 'pimcore_icon_pdf',
                scale: 'small',
                handler: function () {
                    var path = "/en/product-print?id=" + object.id;
                    window.open(path);
                }.bind(this)
            });
            pimcore.layout.refresh();
        }

        if(object.data.general.o_className == 'Car'){
            var tabPanel = object.edit.layout.items.items[0];            
            var carYearComponent = object.edit.dataFields['productionYear'].component;
            var carYear =  Ext.getCmp(carYearComponent.id).getValue();            
            let colorFieldId =  object.edit.dataFields['color'].component.id;           
            
            setTimeout(function(){
                if(carYear < 1960){                    
                    Ext.getCmp(colorFieldId).getEl().hide();             
                }
            },100);

            carYearComponent.on("change", function (field, newValue, oldValue) {
                if(newValue < 1960){                    
                    Ext.getCmp(colorFieldId).getEl().hide();             
                }
                else{
                    Ext.getCmp(colorFieldId).getEl().show();
                }
            });
            
        }
    },

    menuHandler: function () {
        var that = this;

        // let importItem = Ext.create("Ext.data.Store", {
        //     fields: ["id", "name"],
        //     data: responseObj.data,
        // });
        let formItems = [
            {
                xtype: "combobox",
                name: "demoField",
                id: "demoField",
                fieldLabel: "Demo",
                store: ["value1", "value2", "value3"],
                queryMode: "local",
                displayField: "name",
                valueField: "id",
                labelWidth: 150,
                width: 500,
                listeners: {
                    change: function (field, newValue, oldValue) {
                        console.log(newValue);
                    },
                },
            },
            {
                xtype: "filefield",
                id: "zipFile",
                name: "zipFile",
                fieldLabel: "Zip File",
                labelWidth: 150,
                msgTarget: "top",
                buttonText: "Select File...",
                width: 502,
            },
        ];
        let formButtons = [
            {
                text: t("Upload"),
                iconCls: "pimcore_icon_save",
                handler: function () {
                    let form = Ext.getCmp("demoForm").getForm();
                    that.onFormSubmit(form);
                },
            },
        ];

        let configPanel = new Ext.form.Panel({
            id: "demoForm",
            items: formItems,
            buttons: formButtons,
        });

        this.panel = new Ext.Panel({
            id: "demo_panel",
            title: t("Demo Tab"),
            iconCls: "pimcore_icon_export",
            closable: true,
            padding: "10px",
            autoScroll: true,
            items: [
                {
                    xtype: "fieldset",
                    id: "csv_import_form_fieldset",
                    title: t("Import Settings"),
                    //items: [configPanel],
                },
            ],
            style: {
                height: 300,
            },
        });

        // Ext.getCmp("demo_panel").add(configPanel);
        // configPanel.updateLayout();
        // this.panel.updateLayout();
        // pimcore.layout.refresh();

        let tabPanel = Ext.getCmp("pimcore_panel_tabs");
        tabPanel.add(this.panel);
        tabPanel.setActiveItem("demo_panel");
    },
    onFormSubmit: function (form) {
        
            if (form.isValid()) {
                form.submit({
                    url: "/csvimport/import2",
                    method: "POST",
                    waitMsg: "Uploading your file...",
                    success: function (fp, o) {
                        if (o.result.errors == false || o.result.errors == "") {
                            let logger = [];
                            pimcore.helpers.showNotification(
                                t("success"),
                                t(o.result.message),
                                "success"
                            );
                            Ext.Ajax.request({
                                url: "/csvimport/getlogdata",
                                success: function (response) {
                                    let dataRes = response.responseText;
    
                                    if (dataRes) {
                                        let data = Ext.decode(dataRes);
    
                                        Ext.each(data, function (ob) {
                                            Ext.each(
                                                ob,
                                                function (property, value) {
                                                    logger.push({
                                                        row: property.row,
                                                        time: property.time,
                                                        status: property.status,
                                                        type: property.type,
                                                        message: property.message,
                                                    });
                                                }
                                            );
                                        });
                                        let element = Ext.getCmp(
                                            "csv_import_log_fieldset"
                                        );
    
                                        element.removeAll();
    
                                        let pageSize = 10;
                                        let importLogStore = Ext.create(
                                            "Ext.data.Store",
                                            {
                                                fields: [
                                                    "row",
                                                    "time",
                                                    "status",
                                                    "type",
                                                    "message",
                                                ],
                                                data: logger,
                                                autoload: false,
                                                pageSize: pageSize,
                                                proxy: {
                                                    type: "memory",
                                                    enablePaging: true,
                                                    data: logger,
                                                },
                                            }
                                        );
                                        importLogStore.loadPage(1);
    
                                        this.dataGrid = Ext.create(
                                            "Ext.grid.Panel",
                                            {
                                                id: "import_log_gird",
                                                title: "",
                                                store: importLogStore,
                                                columns: [
                                                    {
                                                        text: "RowNo",
                                                        dataIndex: "row",
                                                        width: 50,
                                                    },
                                                    {
                                                        text: "Timestamp",
                                                        dataIndex: "time",
                                                        width: 150,
                                                    },
                                                    {
                                                        text: "Status",
                                                        dataIndex: "status",
                                                        width: 100,
                                                    },
                                                    {
                                                        text: "Type",
                                                        dataIndex: "type",
                                                        width: 100,
                                                    },
                                                    {
                                                        text: "Message",
                                                        dataIndex: "message",
                                                        width: 700,
                                                    },
                                                ],
                                                bbar: new Ext.PagingToolbar({
                                                    displayInfo: true,
                                                    store: importLogStore,
                                                }),
                                            }
                                        );
    
                                        let blob = new Blob([dataRes], {
                                            type: "application/octetstream",
                                        });
                                        let link = "";
    
                                        //Check the Browser type and download the File.
                                        let isIE = false || !!document.documentMode;
                                        if (isIE) {
                                            window.navigator.msSaveBlob(
                                                blob,
                                                "logfile.log"
                                            );
                                        } else {
                                            let url =
                                                window.URL || window.webkitURL;
                                            link = url.createObjectURL(blob);
                                        }
    
                                        // element.add(
                                        //     Ext.create("Ext.button.Button", {
                                        //         id: "download_log_button",
                                        //         text: t("Download Log"),
                                        //         iconCls: "pimcore_nav_icon_import",
                                        //         width: "150px",
                                        //         href: link,
                                        //         style: {
                                        //             "margin-bottom": "10px",
                                        //             clear: "right",
                                        //             float: "left",
                                        //         },
                                        //     })
                                        // );
                                        // element.add(this.dataGrid);
                                    }
                                },
                                failure: function (response) {
                                    //console.log(JSON.stringify(response));
                                },
                            });
                        } else {
                            pimcore.helpers.showNotification(
                                t("error"),
                                t(o.result.message),
                                "error"
                            );
                        }
                    },
                    failure: function (form, action) {
                        Ext.Msg.alert(
                            "Failed",
                            action.result ? action.result.message : "No response"
                        );
                    },
                });
            } else {
                pimcore.helpers.showNotification(
                    t("error"),
                    t("Please fill all mandatory fields"),
                    "error"
                );
            }
        
    },
});

let demo = new pimcore.plugin.demo();
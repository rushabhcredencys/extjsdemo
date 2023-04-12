/*START FOR DEMO*/

pimcore.registerNS("pimcore.plugin.pimcorecustom");
pimcore.plugin.pimcorecustom = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.pimcorecustom";
    },

    initialize: function () {
        pimcore.plugin.broker.registerPlugin(this);        
    },

    pimcoreReady: function (params, broker) {

        var that = this;

        var user = pimcore.globalmanager.get("user");

        if (user.admin) {

            var menu = pimcore.globalmanager.get("layout_toolbar").settingsMenu;

            var panelId = "custom-tab-popup";

            menu.add({
                text: t("custom-tab-popup"),
                handler: function () {
                    that.customPopup();
                    window.customPopupWindow.show();
                }
            });

        }


        if (user.admin) {

            var menu = pimcore.globalmanager.get("layout_toolbar").settingsMenu;

            var panelId = "custom-inside-panel";

            menu.add({
                text: t("My Panel"),
                handler: function () {
                    try {
                        pimcore.globalmanager.get(panelId).activate();
                    }
                    catch (e) {
                        pimcore.globalmanager.add(
                            panelId,
                            new pimcore.tool.genericiframewindow(
                                panelId,
                                '/custom-panel',
                                'pimcore_icon_reports',
                                t('custom-panel')
                            )
                        );
                    }
                }
            });

        }

        
        
        this.navEl = Ext.get("pimcore_menu_file").insertSibling(
            '<li id="pimcore_menu_gridbtton" data-menu-tooltip="All Actions" class="pimcore_menu_item pimcore_menu_needs_children"><img src="/bundles/pimcoreadmin/img/flat-white-icons/heat_map.svg" style="width: 20px"></li>',
            "before"
        );
        this.menu = new Ext.menu.Menu({
            items: [
                {
                    text: "Grid",
                    iconCls: "pimcore_nav_icon_import",
                    handler: function () {
                        that.menuHandler();
                    },
                },
            ],
        });
        pimcore.layout.toolbar.prototype.massupdateMenu = this.menu;
        var toolbar = pimcore.globalmanager.get("layout_toolbar");
        this.navEl.on(
            "mousedown",
            toolbar.showSubMenu.bind(toolbar.massupdateMenu)
        );
        pimcore.plugin.broker.fireEvent("mdsMenuReady", toolbar.massupdateMenu);
    },
    postOpenObject: function (object, type) {
        let className = object.data.general.o_className;

       
    },
    menuHandler: function () { 
        
        Ext.Ajax.setTimeout(60000); // 60 seconds

        //PIMCORE LOADING
        //Ext.get("pimcore_loading").show();

        //Ajax DEMO
        Ext.Ajax.request({
            url:"https://cat-fact.herokuapp.com/facts/",
            method: "GET",
            scope: this,
            async: false,
            success: function (response) {
                console.log("RESPONSE", response);                
            }
        });

        Ext.Ajax.on("beforerequest", function () {            
            Ext.get("pimcore_loading").show();            
        });
        Ext.Ajax.on("requestcomplete", function (conn, response, options) {            
            Ext.get("pimcore_loading").hide();            
        });

        // var store = Ext.create('Ext.data.Store', {
        //     fields: ['firstName', 'level'],
        //     sorters: 'level',            
        //     data: [
        //         { firstName: 'Mitch',  level: 9000},
        //         { firstName: 'Seth',   level: 42},
        //         { firstName: 'Fred',   level: 510},
        //         { firstName: 'Israel', level: 690},
        //         { firstName: 'Greg',   level: 101},
        //         { firstName: 'Pat',    level: 0},              
        //         { firstName: 'Kevin',  level: 17},
        //         { firstName: 'Brandon',level: 690},
        //         { firstName: 'Gary',   level: 409},
        //         { firstName: 'Scott',  level: 789},
        //         { firstName: 'Mitch',  level: 9000},
        //         { firstName: 'Seth',   level: 42},
        //         { firstName: 'Fred',   level: 510},
        //         { firstName: 'Israel', level: 690},
        //         { firstName: 'Greg',   level: 101},
        //         { firstName: 'Pat',    level: 0},              
        //         { firstName: 'Kevin',  level: 17},
        //         { firstName: 'Brandon',level: 690},
        //         { firstName: 'Gary',   level: 409},
        //         { firstName: 'Scott',  level: 789}
        //     ]
        //  });

        var dataArray = [
            { firstName: 'Mitch',  level: 9000},
            { firstName: 'Seth',   level: 42},
            { firstName: 'Fred',   level: 510},
            { firstName: 'Israel', level: 690},
            { firstName: 'Greg',   level: 101},
            { firstName: 'Pat',    level: 0},              
            { firstName: 'Kevin',  level: 17},
            { firstName: 'Brandon',level: 690},
            { firstName: 'Gary',   level: 409},
            { firstName: 'Scott',  level: 789},
            { firstName: 'Mitch',  level: 9000},
            { firstName: 'Seth',   level: 42},
            { firstName: 'Fred',   level: 510},
            { firstName: 'Israel', level: 690},
            { firstName: 'Greg',   level: 101},
            { firstName: 'Pat',    level: 0},              
            { firstName: 'Kevin',  level: 17},
            { firstName: 'Brandon',level: 690},
            { firstName: 'Gary',   level: 409},
            { firstName: 'Scott',  level: 789}
        ];

         let pageSize = 10; 
         let store = Ext.create( "Ext.data.Store", 
            { fields: [ "firstName", "level"], 
                data: dataArray,
                autoload: false, 
                pageSize: pageSize, 
                proxy: { type: "memory", enablePaging: true, data: dataArray, }, 
            });

         var states = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"AL", "name":"Alabama"},
                {"abbr":"AK", "name":"Alaska"},
                {"abbr":"AZ", "name":"Arizona"}
            ]
        });

        

        let formItems = [
            {
                xtype: "grid",
                name: "sequenceGrid",
                id: "sequenceGrid",
                store: store,
                hidden: false,
                forceFit: true,
                columns: [
                    { text: 'Name',  dataIndex: 'firstName' },
                    {
                        text: "level",
                        name: "level",
                        dataIndex: "level",
                        menuDisabled: true,
                        editor: {
                            field: {
                                xtype:"numberfield",
                                // xtype: "tagfield",                                
                                // store:[123,5456],
                                labelWidth: 162,
                                allowBlank: true                               
                            },
                        },
                    },
                ],
                dockedItems: [
                    {
                        xtype: "pagingtoolbar",
                        id: "pagingSequence",
                        store: store,
                        dock: "bottom",
                        displayInfo: true,
                    },
                ],
                plugins: [
                    {
                        ptype: "cellediting",
                        clicksToEdit: 1,
                    },
                ],
                // selModel: {
                //     selType: "cellmodel",
                //     store: importItemStore,
                // },
                height: "100%",
                width: "100%",
            },            
            {   
                xtype: 'combobox',                
                triggerAction: 'all',
                fieldLabel: 'Select State',
                store: [
                    ['sparklineline',     'Line'],
                    ['sparklinebox',      'Box'],
                    ['sparklinebullet',   'Bullet'],
                    ['sparklinediscrete', 'Discrete'],
                    ['sparklinepie',      'Pie'],
                    ['sparklinetristate', 'TriState']
                ]
            },
            {
                xtype: 'textfield',
                reference: 'username', // A named reference to be held on the referenceHolder
                name: 'username',
                fieldLabel: 'Username',
                allowBlank: false,
                validator: function (enteredValue) {
                    console.log("ENTERENED VALUE ", enteredValue);
                    return true;
                }
            }, 
            {
                xtype: 'textfield',
                reference: 'password', // A named reference to be held on the referenceHolder
                name: 'password',
                fieldLabel: 'Password'
            },
            {
                xtype: 'filefield',
                buttonOnly: true,
                width: 100,
                buttonConfig: {
                    text: 'Add logo',
                    width: '100%',
                    ui: 'default-toolbar-small'
                },
                listeners: {
                    change: function (filefield) {
                        console.log("FILE", filefield);
                        //filefield.up('form').submit();
                    }            
                }
            },            
            {
                xtype: "button",
                text: "Submit",
                handler: function () {
                    let records = [];
                    let oldRec = [];
                    let errors = 0;  
                    
                    let form = Ext.getCmp("gridForm").getForm();                    
                    if (form.isValid()) {
                        Ext.Msg.alert('Click', 'Perform the operation');
                    }                    
                },
            },              
            {
                xtype: "button",
                text: "Display Window",
                handler: function () {
                    this.customPopup();
                    window.customPopupWindow.show();
                }.bind(this),
            },
            {
                xtype: "button",
                text: "Export CSV",
                iconCls: "pimcore_icon_export",
                style: {
                    margin: "0 0px 10px 10px",
                    "border-color": "#298e4b",
                },
                handler: function () {
                    let columnNames = [
                        "firstName",
                        "level"
                    ];
                    let mealData = [];                    
                    store.config.data.forEach(function (rec) {
                        mealData.push(Ext.apply({}, rec));
                    });
                    console.log(mealData);
                    Ext.Ajax.request({
                        url: "/export-MealCode",
                        method: "GET",
                        params: {
                            columnNames: columnNames.toString(),
                            data: JSON.stringify(mealData),
                        },
                        success: function (response) {
                            const a = document.createElement("a");
                            document.body.appendChild(a);
                            a.style = "display: none";
                            const blob = new Blob([response.responseText], {
                                    type: "octet/stream",
                                }),
                                url = window.URL.createObjectURL(blob);
                            a.href = url;
                            a.download = "mealcode_import.csv";
                            a.click();
                            window.URL.revokeObjectURL(url);
                        },
                    });
                },
            },
            {
                text:t("apply"),
                iconCls:"pimcore_icon_apply",
                autoWidth:true,
                handler:function () {
                    Ext.MessageBox.confirm(t("are_you_sure"), t("all_content_will_be_lost"),
                    function (buttonValue) {
                        if (buttonValue == "yes") {
                            this.document.reload();
                        }
                    }.bind(this));
                }
            }
           
        ];



        

        
        
        configPanel = new Ext.form.Panel({ id: "gridForm", hidden: false, items: formItems });

        this.panel = new Ext.Panel({
            id: "demoPanel",
            title: t("Demo grid"),
            icon: "/bundles/pimcoreadmin/img/flat-white-icons/tree_select.svg",
            closable: true,
            padding: "10px",
            autoScroll: true,
            items: [
                {
                    xtype: "fieldset",
                    id: "airlineseq_module",
                    title: t("Demo Panel"),
                    items: [],
                },
            ],
            style: {
                height: "200%",
            },
        });
        Ext.getCmp("demoPanel").add(configPanel);
        configPanel.updateLayout();
        this.panel.updateLayout();
        pimcore.layout.refresh();
        let tabPanel = Ext.getCmp("pimcore_panel_tabs");
        tabPanel.add(this.panel);
        tabPanel.setActiveItem("demoPanel");
    },
    customPopup: function (){
        var languagestore = [];
        var websiteLanguages = pimcore.settings.websiteLanguages;
        var selectContent = "";
        for (var i = 0; i < websiteLanguages.length; i++) {
            
                selectContent = pimcore.available_languages[websiteLanguages[i]] + " [" + websiteLanguages[i] + "]";
                languagestore.push([websiteLanguages[i], selectContent]);
            
        }

        var pageForm = new Ext.form.FormPanel({
            border: false,
            defaults: {
                labelWidth: 170
            },
            items: [{
                xtype: "combo",
                name: "language",
                store: languagestore,
                editable: false,
                triggerAction: 'all',
                mode: "local",
                fieldLabel: t('language'),
                listeners: {
                    select: function (el) {
                        pageForm.getComponent("parent").disable();
                        Ext.Ajax.request({
                            url: Routing.generate('pimcore_admin_document_document_translationdetermineparent'),
                            params: {
                                language: el.getValue(),
                                id: this.id
                            },
                            success: function (response) {
                                var data = Ext.decode(response.responseText);
                                if (data["success"]) {
                                    pageForm.getComponent("parent").setValue(data["targetPath"]);
                                }
                                pageForm.getComponent("parent").enable();
                            }
                        });
                    }.bind(this)
                }
            }, {
                xtype: "textfield",
                name: "parent",
                itemId: "parent",
                width: "100%",
                fieldCls: "input_drop_target",
                fieldLabel: t("parent"),
                listeners: {
                    "render": function (el) {
                        new Ext.dd.DropZone(el.getEl(), {
                            reference: this,
                            ddGroup: "element",
                            getTargetFromEvent: function (e) {
                                return this.getEl();
                            }.bind(el),

                            onNodeOver: function (target, dd, e, data) {
                                if (data.records.length === 1 && data.records[0].data.elementType === "document") {
                                    return Ext.dd.DropZone.prototype.dropAllowed;
                                }
                            },

                            onNodeDrop: function (target, dd, e, data) {

                                if (!pimcore.helpers.dragAndDropValidateSingleItem(data)) {
                                    return false;
                                }

                                data = data.records[0].data;
                                if (data.elementType === "document") {
                                    this.setValue(data.path);
                                    return true;
                                }
                                return false;
                            }.bind(el)
                        });
                    }
                }
            }, {
                xtype: "textfield",
                itemId: "title",
                fieldLabel: t('title'),
                name: 'title',
                width: "100%",
                enableKeyEvents: true,
                listeners: {
                    keyup: function (el) {
                        pageForm.getComponent("name").setValue(el.getValue());
                        pageForm.getComponent("key").setValue(el.getValue());
                    }
                }
            }, {
                xtype: "textfield",
                itemId: "name",
                fieldLabel: t('navigation'),
                name: 'name',
                width: "100%"
            }, {
                xtype: "textfield",
                width: "100%",
                fieldLabel: t('key'),
                itemId: "key",
                name: 'key'
            }]
        });

        var win = new Ext.Window({
            width: 600,
            bodyStyle: "padding:10px",
            items: [pageForm],
            buttons: [{
                text: t("cancel"),
                iconCls: "pimcore_icon_cancel",
                handler: function () {
                    win.close();
                }
            }, {
                text: t("apply"),
                iconCls: "pimcore_icon_apply",
                handler: function () {

                    var params = pageForm.getForm().getFieldValues();
                    win.disable();

                    Ext.Ajax.request({
                        url: Routing.generate('pimcore_admin_element_getsubtype'),
                        params: {
                            id: pageForm.getComponent("parent").getValue(),
                            type: "document"
                        },
                        success: function (response) {
                            var res = Ext.decode(response.responseText);
                            if (res.success) {
                                if (params["key"].length >= 1) {
                                    params["parentId"] = res["id"];
                                    params["type"] = this.getType();
                                    params["translationsBaseDocument"] = this.id;
                                    if (inheritance) {
                                        params["inheritanceSource"] = this.id;
                                    }

                                    Ext.Ajax.request({
                                        url: Routing.generate('pimcore_admin_document_document_add'),
                                        method: 'POST',
                                        params: params,
                                        success: function (response) {
                                            response = Ext.decode(response.responseText);
                                            if (response && response.success) {
                                                pimcore.helpers.openDocument(response.id, response.type);
                                            }
                                        }
                                    });
                                }
                            } else {
                                Ext.MessageBox.alert(t("error"), t("element_not_found"));
                            }

                            win.close();
                        }.bind(this)
                    });
                }.bind(this)
            }]
        });

        window.customPopupWindow = win;
    }
});

let pimcorecustom = new pimcore.plugin.pimcorecustom();
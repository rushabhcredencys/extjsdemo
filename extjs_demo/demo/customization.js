// Ext.define('pimcore.filters', {
//     extend: 'Ext.grid.filters.Filters',
//     alias: 'plugin.pimcore.gridfilters',
//     menuFilterText: t('filter'),

//     createColumnFilter: function(column) {
//         console.log("MY CUSTOM CODE", column.filter);

//         this.callSuper(arguments);
//         var type = column.filter.type;
//         var theFilter = column.filter.filter;

//         console.log(type);
//         if(column.filter instanceof Ext.grid.filters.filter.Number){
//             console.log(" theFilter ", column.filter.fields);
//         }
//         else if (column.filter instanceof Ext.grid.filters.filter.TriFilter) {
//             theFilter.lt.config.type = type;
//             theFilter.gt.config.type = type;
//             theFilter.eq.config.type = type;

//             if (column.decimalPrecision) {
//                 column.filter.fields.lt.decimalPrecision = column.decimalPrecision;
//                 column.filter.fields.gt.decimalPrecision = column.decimalPrecision;
//                 column.filter.fields.eq.decimalPrecision = column.decimalPrecision;
//             }
//         } else {
//             theFilter.config.type = type;
//         }
//     },  
//     onAdd: function(headerCt, column, index) {
//         console.log("HERE I AM");
//         var filter = column.filter;
//         console.log("FILTER :", filter);

//         if (filter && !filter.isGridFilter) {
//             this.createColumnFilter(column);
//         }
//     }

// });



//Fix - Date picker does not align to component in scrollable container and breaks view layout randomly.
Ext.override(Ext.picker.Date, {
    afterComponentLayout: function (width, height, oldWidth, oldHeight) {        
        var field = this.pickerField;
        this.callParent([
            width,
            height,
            oldWidth,
            oldHeight
        ]);
        // Bound list may change size, so realign on layout
        // **if the field is an Ext.form.field.Picker which has alignPicker!**
        if (field && field.alignPicker) {
            field.alignPicker();
        }
    },
    onSelect: function() {
        Ext.Msg.alert('Offer', 'Do some changes related to offer date');
    }
});
console.log("HERE I AM");
Ext.override('pimcore.object.tags.manyToManyObjectRelation', {
    getCreateControl: function () {

        var allowedClasses;
        var i;

        var classStore = pimcore.globalmanager.get("object_types_store");
        if (this.fieldConfig.classes != null && this.fieldConfig.classes.length > 0) {
            allowedClasses = [];
            for (i = 0; i < this.fieldConfig.classes.length; i++) {
                if (this.fieldConfig.classes[i].classes) {
                    allowedClasses.push(this.fieldConfig.classes[i].classes);
                }
            }
        } else if (this.fieldConfig.ownerClassName) {
            allowedClasses = [];
            allowedClasses.push(this.fieldConfig.ownerClassName);
        } else if (classStore.data && classStore.data.items && classStore.data.items.length > 0) {
            allowedClasses = [];
            for (i = 0; i < classStore.data.items.length; i++) {
                allowedClasses.push(classStore.data.items[i].data.text);
            }

        }

        var collectionMenu = [];

        if (allowedClasses && allowedClasses.length > 0) {
            for (i = 0; i < allowedClasses.length; i++) {
                collectionMenu.push({
                    text: t(allowedClasses[i]),
                    handler: this.create.bind(this, allowedClasses[i]),
                    iconCls: "pimcore_icon_fieldcollection"
                });
            }
        }
        var items = [];

        // if (this.fieldConfig.allowToCreateNewObject) {
        //     if (collectionMenu.length == 1) {
        //         items.push({
        //             cls: "pimcore_block_button_plus",
        //             iconCls: "pimcore_icon_plus",
        //             handler: collectionMenu[0].handler
        //         });
        //     } else if (collectionMenu.length > 1) {
        //         items.push({
        //             cls: "pimcore_block_button_plus",
        //             iconCls: "pimcore_icon_plus",
        //             menu: collectionMenu
        //         });
        //     } else {
        //         items.push({
        //             xtype: "tbtext",
        //             text: t("no_collections_allowed")
        //         });
        //     }
        // }


        return items[0];
    }
});
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

Ext.override('pimcore.object.tags.manyToManyObjectRelation', {
    initialize: function (data, fieldConfig) {
        console.log("HERE I AM");
    }
});
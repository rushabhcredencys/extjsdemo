(function(){
    var test     = this;
    var wishlistdata = this.object.edit.dataFields['endOfferDate'].component.lastValue;
    //console.log(wishlistdata);
            Ext.Ajax.request({
                    url: "/trigger-car-callback",
                    method: "POST",
                    params: {
                        carId: this.object.id,
                        offerDate: Ext.encode(wishlistdata),
                    },
                    success: function (response, action) { 
    test.object.dirty = false;
    test.object.reload();
    Ext.Msg.alert('Status', 'Changes saved successfully.');
                    }
                });
            });
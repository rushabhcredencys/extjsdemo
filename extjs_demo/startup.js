pimcore.registerNS("pimcore.plugin.extendadmin");

pimcore.plugin.extendadmin = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.extendadmin";
    },

    initialize: function () {
        pimcore.plugin.broker.registerPlugin(this);

    },

    // postOpenObject: function (object, type) {
    //     if (object.data.general.o_className == 'Car' && object.data.data.objectType == "actual-car") {
    //         object.toolbar.add({
    //             text: t('print-pdf'),
    //             iconCls: 'pimcore_icon_pdf',
    //             scale: 'small',
    //             handler: function () {
    //                 var path = "/en/product-print?id=" + object.id;
    //                 window.open(path);
    //             }.bind(this)
    //         });
    //         pimcore.layout.refresh();
    //     }
    // }
});

var extendadmin = new pimcore.plugin.extendadmin();

/* Custom report */
pimcore.registerNS("pimcore.plugin.AcademyBundle");

pimcore.plugin.AcademyBundle = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.AcademyBundle";
    },

    initialize: function () {
        pimcore.plugin.broker.registerPlugin(this);
    },

    pimcoreReady: function (params, broker) {
        var user = pimcore.globalmanager.get("user");

        if (user.admin || user.isAllowed("some_permission")) {

            var menu = pimcore.globalmanager.get("layout_toolbar").settingsMenu;

            var panelId = "my-custom-report-panel";

            menu.add({
                text: t("some-custom-report"),
                handler: function () {
                    try {
                        pimcore.globalmanager.get(panelId).activate();
                    }
                    catch (e) {
                        pimcore.globalmanager.add(
                            panelId,
                            new pimcore.tool.genericiframewindow(
                                panelId,
                                '/academy-iframe',
                                'pimcore_icon_reports',
                                t('some-custom-report')
                            )
                        );
                    }
                }
            });

        }
    }

});

var AcademyBundlePlugin = new pimcore.plugin.AcademyBundle();
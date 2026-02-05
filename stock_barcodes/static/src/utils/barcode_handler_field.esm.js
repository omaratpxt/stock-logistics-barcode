import {BarcodeHandlerField} from "@barcodes/barcode_handler_field";
import {patch} from "@web/core/utils/patch";
import {useService} from "@web/core/utils/hooks";
const {useEffect} = owl;

patch(BarcodeHandlerField.prototype, {
    /* eslint-disable no-unused-vars */
    setup() {
        super.setup(...arguments);
        const busService = useService("bus_service");
        this.orm = useService("orm");
        const handleStockBarcodesRefreshData = async (payload) => {
            await this.env.model.root.load();
            this.env.model.notify();
        };
        useEffect(() => {
            busService.addChannel("barcode_reload");
            busService.subscribe(
                "stock_barcodes_refresh_data",
                handleStockBarcodesRefreshData
            );
            return () => {
                busService.unsubscribe(
                    "stock_barcodes_refresh_data",
                    handleStockBarcodesRefreshData
                );
                busService.deleteChannel("barcode_reload");
            };
        });
    },
    onBarcodeScanned(event) {
        super.onBarcodeScanned(...arguments);
        if (this.props.record.resModel.includes("wiz.stock.barcodes.read")) {
            document.getElementById("dummy_on_barcode_scanned")?.click();
        }
    },
});

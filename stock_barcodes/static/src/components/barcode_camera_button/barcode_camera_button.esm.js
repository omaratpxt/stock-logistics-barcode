/** @odoo-module **/

import {Component} from "@odoo/owl";
import {_t} from "@web/core/l10n/translation";
import {
    applyBarcodeToMainMenu,
    applyBarcodeToPickingKanban,
    applyBarcodeToRecord,
    canUseCameraBarcode,
    scanWithCamera,
} from "../../utils/camera_barcode.esm";

export class BarcodeCameraButton extends Component {
    static template = "stock_barcodes.BarcodeCameraButton";
    static props = {
        mode: {
            type: String,
            optional: true,
            validate: (mode) =>
                ["wizard", "main_menu", "kanban", "inline"].includes(mode),
        },
        record: {type: Object, optional: true},
        searchModel: {type: Object, optional: true},
        className: {type: String, optional: true},
        title: {type: String, optional: true},
    };
    static defaultProps = {
        mode: "inline",
        className: "",
        title: "",
    };

    get showCameraButton() {
        return canUseCameraBarcode();
    }

    get buttonTitle() {
        return this.props.title || _t("Scan with camera");
    }

    async onClickCamera() {
        const barcode = await scanWithCamera(this.env);
        if (!barcode) {
            return;
        }
        switch (this.props.mode) {
            case "wizard":
                await applyBarcodeToRecord(this.props.record, barcode);
                break;
            case "main_menu":
                await applyBarcodeToMainMenu(this.env, barcode);
                break;
            case "kanban":
                await applyBarcodeToPickingKanban(
                    this.env,
                    barcode,
                    this.props.searchModel
                );
                break;
            default:
                break;
        }
    }
}

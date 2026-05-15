/** @odoo-module **/

import {Component} from "@odoo/owl";
import {registry} from "@web/core/registry";
import {standardWidgetProps} from "@web/views/widgets/standard_widget_props";
import {BarcodeCameraButton} from "../components/barcode_camera_button/barcode_camera_button.esm";

export class BarcodeCameraWidget extends Component {
    static template = "stock_barcodes.BarcodeCameraWidget";
    static components = {BarcodeCameraButton};
    static props = {
        ...standardWidgetProps,
        class: {type: String, optional: true},
    };
}

registry.category("view_widgets").add("barcode_camera", {
    component: BarcodeCameraWidget,
});

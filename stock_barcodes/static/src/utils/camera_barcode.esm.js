/** @odoo-module **/

import {isMobileOS} from "@web/core/browser/feature_detection";
import {isBarcodeScannerSupported} from "@web/core/barcode/barcode_video_scanner";
import {scanBarcode} from "@web/core/barcode/barcode_dialog";
import {_t} from "@web/core/l10n/translation";

export function canUseCameraBarcode() {
    return isMobileOS() && isBarcodeScannerSupported();
}

/**
 * @param {import("@web/env").OdooEnv} env
 * @returns {Promise<string|false>}
 */
export async function scanWithCamera(env) {
    try {
        return await scanBarcode(env, "environment");
    } catch (error) {
        if (error?.message) {
            env.services.notification.add(error.message, {type: "danger"});
        }
        return false;
    }
}

/**
 * @param {import("@web/model/relational_model/record").Record} record
 * @param {string} barcode
 */
export async function applyBarcodeToRecord(record, barcode) {
    if (!record || !barcode) {
        return;
    }
    const resModel = record.resModel;
    if (resModel.includes("wiz.stock.barcodes.read")) {
        await record.update({_barcode_scanned: barcode});
        document.getElementById("dummy_on_barcode_scanned")?.click();
        return;
    }
    if (resModel === "wiz.stock.barcodes.new.lot") {
        await record.model.orm.call(resModel, "on_barcode_scanned", [
            [record.resId],
            barcode,
        ]);
        await record.load();
        return;
    }
    await record.update({_barcode_scanned: barcode});
}

/**
 * @param {import("@web/env").OdooEnv} env
 * @param {string} barcode
 */
export async function applyBarcodeToMainMenu(env, barcode) {
    await env.services.orm.call("wiz.stock.barcodes.read", "process_barcode", [
        [],
        barcode,
    ]);
}

/**
 * @param {import("@web/env").OdooEnv} env
 * @param {string} barcode
 * @param {import("@web/search/search_model").SearchModel} searchModel
 */
export async function applyBarcodeToPickingKanban(env, barcode, searchModel) {
    const domain = await env.services.orm.call(
        "stock.picking",
        "barcode_kanban_search_domain",
        [],
        barcode
    );
    if (!domain) {
        env.services.notification.add(
            _t("No transfer found for barcode: %(barcode)s", {barcode}),
            {type: "warning"}
        );
        return;
    }
    searchModel.splitAndAddDomain(domain);
}

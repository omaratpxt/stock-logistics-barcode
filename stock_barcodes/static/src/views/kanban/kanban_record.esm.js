/* Copyright 2022 Tecnativa - Alexandre D. Díaz
 * License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl). */

import {KanbanRecord} from "@web/views/kanban/kanban_record";
import {patch} from "@web/core/utils/patch";

patch(KanbanRecord.prototype, {
    props: {
        ...KanbanRecord.props,
    },

    setup() {
        super.setup(...arguments);
    },

    async onGlobalClick(ev) {
        if (ev.target.closest(".oe_kanban_global_click")) {
            const recordBarcode = document.querySelector(
                'div[name="inventory_quant_ids"]'
            );

            if (recordBarcode) {
                const id = this.props.record.resId;

                document
                    .querySelectorAll(".oe_kanban_operations")
                    .forEach((el) => el.classList.add("d-none"));

                document
                    .querySelector(`.oe_kanban_operations-${id}`)
                    ?.classList.remove("d-none");

                return;
            }
        }

        await super.onGlobalClick(...arguments);
    },
});

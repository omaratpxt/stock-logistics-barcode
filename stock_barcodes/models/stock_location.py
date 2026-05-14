from odoo import models


class StockLocation(models.Model):
    _inherit = "stock.location"

    _rec_names_search = ["complete_name", "barcode"]

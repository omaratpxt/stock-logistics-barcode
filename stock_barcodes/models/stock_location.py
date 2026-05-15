from odoo import api, models
from odoo.fields import Domain


class StockLocation(models.Model):
    _inherit = "stock.location"

    _rec_names_search = ["complete_name", "barcode"]

    @api.model
    def _name_search(self, name, domain=None, operator="ilike", limit=None, order=None):
        positive_operators = ("=", "ilike", "=ilike", "like", "=like")
        if name and operator in positive_operators:
            search_domain = Domain.OR(
                [
                    Domain("complete_name", operator, name),
                    Domain("barcode", operator, name),
                ]
            )
            if domain:
                search_domain = Domain.AND([Domain(domain), search_domain])
            return self._search(search_domain, limit=limit, order=order)
        return super()._name_search(name, domain, operator, limit, order)

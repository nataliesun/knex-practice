const ShoppingListService = {
    getAllListItems(knex) {
        return knex.select('*').from('shopping_list')
    },
    insertListItem(knex, newItem) {
        return knex
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => rows[0])
    },
    getById(knex, id) {
        return knex
            .from('shopping_list')
            .select('*')
            .where('id', id).first()
    },
    deleteListItem(knex, id) {
        return knex('shopping_list')
            .where({ id })
            .delete()
    },
    updateListItem(knex, id, newItemFields) {
        return knex('shopping_list')
            .where({ id })
            .update(newItemFields)
    }
}

module.exports = ShoppingListService
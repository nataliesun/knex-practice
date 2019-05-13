const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe.only(`ShoppingList service object`, function () {
    let db

    let testItems = [
        {
            id: 1,
            name: 'Fish tricks',
            price: '13.10',
            category: 'Main',
            checked: false,
            date_added: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 2,
            name: 'Not Dogs',
            price: '4.99',
            category: 'Snack',
            checked: true,
            date_added: new Date('2100-05-22T16:28:32.615Z')
        },
        {
            id: 3,
            name: 'Bluffalo Wings',
            price: '5.50',
            category: 'Snack',
            checked: false,
            date_added: new Date('1919-12-22T16:28:32.615Z')
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.DB_URL
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })

        it(`getAllListItems() resolves all items from 'shopping_list' table`, () => {
            return ShoppingListService.getAllListItems(db)
                .then(actual => expect(actual).to.eql(testItems))
        })

        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdShoppingListItem = testItems[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql(thirdShoppingListItem)
                })
        })

        it(`updateListItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                name: 'Updated name',
                price: "1.00",
                category: 'Main',
                checked: true,
                date_added: new Date()
            }
            return ShoppingListService.updateListItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => expect(item).to.eql({
                    id: idOfItemToUpdate,
                    ...newItemData
                }))
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves to an empty array`, () => {
            return ShoppingListService.getAllListItems(db)
                .then(actual => expect(actual).to.eql([]))
        })

        it(`insertListItem() inserts a new item and resolves to new items with an 'id'`, () => {
            const newListItem = {
                name: 'Test new name',
                category: 'Main',
                checked: false,
                price: '2.00',
                date_added: new Date('2020-01-01T00:00:00.000Z')
            }
            return ShoppingListService.insertListItem(db, newListItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        ...newListItem
                    })
                })
        })
    })
})
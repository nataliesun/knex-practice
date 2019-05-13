require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

function findBySearchTerm(searchTerm = '') {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

// findBySearchTerm('leaf')

function findByPage(pageNumber) {
    const productsPerPage = 6;
    const offset = productsPerPage * (pageNumber - 1);

    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

// findByPage(2)

function findItemsAddedAfter(daysAgo) {
    knexInstance
        .select('*')
        .where(
            'date_added',
            '<',
            knexInstance.raw(`now() - '?? days'::INTERVAL`,
                daysAgo)
        )
        // .toQuery()
        .from('shopping_list')
        .then(result => {
            console.log(result)
        })

    // console.log(qry)
}

// findItemsAddedAfter(3)

function totalCostOfEachCat() {
    knexInstance
        .select('category')
        .sum('price AS total')
        .from('shopping_list')
        .groupBy('category')
        .then(res => {
            console.log(res)
        })
}

totalCostOfEachCat()
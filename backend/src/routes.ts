import express from 'express'
import knex from '../src/database/connection'

const routes = express.Router()

routes.get('/items', async (req, res)=>{
    const items = await knex('items').select('*')

    const serializedItems = items.map(items => {
        return {
            id: items.id,
            title: items.title,
            item_url: `http://localhost:3333/uploads/${items.image}`
        }
    })

    return res.json(serializedItems)
})

routes.post('/points', async (req, res)=>{
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items
    } = req.body

    const insertedId = await knex('points').insert({
        image: 'image-fake',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
    })

    const points_id = insertedId[0]

    const pointItems = await items.map((items_id: Number)=>{
        return {
            items_id,
            points_id
        }
    })

    await knex('points_items').insert(pointItems)

    return res.json({sucess:true})
})

export default routes
const express = require('express')
const sql = require('mssql')
const config = require('../utils/config')


let forumRoute = express.Router()





forumRoute.get('/', async (req, res) => {
    try {

        let db = await sql.connect(config.db)

        let query = await db.request().execute('Select_types_user')

        let data = await query.recordset
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})





forumRoute.get('/:id', async (req, res) => {
    try {
        let params = req.params

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('UserType_code', sql.Int, params.id)
            .execute('Select_types_user_by_usercode')

        let data = await query.recordset
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})






forumRoute.post('/add', async (req, res) => {
    try {
        let body = req.body

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('UserType_Description', sql.NVarChar(20), body.UserType_Description)
            .output('UserType_code', sql.Int)
            .execute('Add_types_user')

        let data = await query.result
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})





forumRoute.put('/update/:id', async (req, res) => {
    try {
        let body = req.body

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('UserType_Description', sql.NVarChar(150), body.UserType_Description)
            .output('UserType_code', sql.Int)
            .execute('Update_types_users')

        let data = await query
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})



module.exports = forumRoute



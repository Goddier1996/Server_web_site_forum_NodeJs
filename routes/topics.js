const express = require('express')
const sql = require('mssql')
const config = require('../utils/config')


let forumRoute = express.Router()




forumRoute.get('/', async (req, res) => {

    try {
        let db = await sql.connect(config.db)

        let query = await db.request().execute('Select_topic')

        let data = await query.recordset
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})





forumRoute.get('/show', async (req, res) => { 

    try {
        let db = await sql.connect(config.db)

        let query = await db.request().execute('Show_topics_Deleted')

        let data = await query.recordset
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})








forumRoute.get('/:id/showTopicsUser', async (req, res) => {

    let params = req.params

    try {
        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Publish_by', sql.Int, params.id)
            .execute('Select_topic_by_PublishBy')

        let data = await query.recordset
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})





// לדף עדכון אשכול - הצגה של הנתונים הישנים בשדות 
forumRoute.get('/:id', async (req, res) => {

    try {
        let params = req.params

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Serial_code', sql.Int, params.id)
            .execute('Select_topic_by_Serialcode')

        let data = await query.recordset
        res.send(data)


    } catch (error) {
        res.send(error)
    }
})





// לא השתמשנו
forumRoute.get('/:id/MainTopicDeleted', async (req, res) => {

    try {
        let params = req.params

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Serial_code', sql.Int, params.id)
            .execute('Select_topic_deleted_by_Serialcode')

        let data = await query.recordset
        res.send(data)


    } catch (error) {
        res.send(error)
    }
})





//לדף הודעה - הצגת האשכולים עצמם בדף ההודעה
forumRoute.get('/:id/message', async (req, res) => {

    try {
        let params = req.params

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Serial_code', sql.Int, params.id)
            .execute('Select_topic_by_Serialcode')

        let data = await query.recordset
        res.send(data)


    } catch (error) {
        res.send(error)
    }
})





// הוספת אשכול - הודעה
forumRoute.post('/add', async (req, res) => {
    try {
        let body = req.body

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Category_code', sql.Int, body.Category_code)
            .input('TopicTitle', sql.NVarChar(200), body.TopicTitle)
            .input('TopicText', sql.NText, body.TopicText)
            .input('DatePublished', sql.Date, body.DatePublished)
            .input('Publish_by', sql.Int, body.Publish_by)
            .output('Serial_code', sql.Int)
            .execute('Add_topics')

        let data = await query.result
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})






// עדכון אשכול - הודעה
forumRoute.put('/update/:id', async (req, res) => {

    try {
        let params = req.params
        let body = req.body

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Serial_code', sql.Int, params.id)
            .input('Category_code', sql.Int, body.Category_code)
            .input('TopicTitle', sql.NVarChar(200), body.TopicTitle)
            .input('TopicText', sql.NText, body.TopicText)
            .input('DatePublished', sql.Date, body.DatePublished)
            .input('Publish_by', sql.Int, body.Publish_by)
            .execute('Update_topics')

        let data = await query
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})





// מחיקת אשכול לפי מספר סידורי
forumRoute.delete('/delete/:id', async (req, res) => {

    try {
        let params = req.params

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Serial_code', sql.Int, params.id)
            .execute('Delete_topic')

        let data = await query
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})




// מלא פעיל לפעיל לפי המספר סידורי 
forumRoute.put('/reactivate/:id', async (req, res) => {

    try {
        let params = req.params

        let db = await sql.connect(config.db)
        
        let query = await db.request()
            .input('Serial_code', sql.Int, params.id)
            .execute('Reactivate_topic')

        let data = await query
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})


module.exports = forumRoute
const express = require('express')
const sql = require('mssql')
const config = require('../utils/config')


let forumRoute = express.Router()




forumRoute.get('/', async (req, res) => {

    try {
        let db = await sql.connect(config.db)

        let query = await db.request().execute('select_comment')
    
        let data = await query.recordset
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})






forumRoute.get('/show', async (req, res) => {

    try {
        let db = await sql.connect(config.db)

        let query = await db.request().execute('Show_comments_Deleted')

        let data = await query.recordset
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})






forumRoute.get('/:id/showCommentsUser', async (req, res) => {

    let params = req.params

    try {
        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Publish_by', sql.Int, params.id)
            .execute('Select_comment_by_PublishBy')

        let data = await query.recordset
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})



// הצגת תגובה לפי הקוד הסידורי שלה
forumRoute.get('/:id', async (req, res) => {

    try {
        let params = req.params

        let db = await sql.connect(config.db)
    
        let query = await db.request()
            .input('Serial_code', sql.Int, params.id)
            .execute('select_comment_by_Serialcode')
    
        let data = await query.recordset
        res.send(data)
    
          
    } catch (error) {
        res.send(error)
    }
})







forumRoute.get('/:id/comments', async (req, res) => {

    try {
        let params = req.params

        let db = await sql.connect(config.db)
    
        let query = await db.request()
            .input('Topic_number', sql.Int, params.id)
            .execute('Select_comment_by_TopicNumber')
    
        let data = await query.recordset
        res.send(data)
    

    } catch (error) {
        res.send(error)
    }
})




// לא השתמשנו
forumRoute.get('/:id/commentsDeletedByTopic', async (req, res) => {

    try {
        let params = req.params

        let db = await sql.connect(config.db)
    
        let query = await db.request()
            .input('Topic_number', sql.Int, params.id)
            .execute('Select_comment_deleted_by_TopicNumber')
    
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
        .input('Topic_number', sql.Int, parseInt(body.Topic_number))
        .input('Comment', sql.NVarChar(150), body.Comment)
        .input('Publish_by', sql.Int, parseInt(body.Publish_by))
        .input('Date_published', sql.Date, body.Date_published)
        .output('Serial_code', sql.Int)
        .execute('Add_comments')

        let data = await query
        body.Serial_code = data.output.Serial_code;
        res.send(body)

    } catch (error) {
        res.send(error)
    }
})






forumRoute.put('/update/:id', async (req, res) => {

    try {
        let body = req.body
    
        let db = await sql.connect(config.db)

        let query = await db.request()
        .input('Serial_number', sql.Int, body.Serial_number)
        .input('comment', sql.NVarChar(150), body.comment)
        .input('writer_comment', sql.NVarChar(20), body.writer_comment)
        .output('Serial_code', sql.Int)
        .execute('update_comment')
    
        let data = await query
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})






forumRoute.delete('/delete/:id', async (req, res) => {

    try {
        let params = req.params
    
        let db = await sql.connect(config.db)

        let query = await db.request()
        .input('Serial_code', sql.Int, params.id)
        .execute('delete_comment')
    
        let data = await query    
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})





forumRoute.put('/reactivate/:id', async (req, res) => {

    try {
        let params = req.params
    
        let db = await sql.connect(config.db)
        
        let query = await db.request()
        .input('Serial_code', sql.Int, params.id)
        .execute('reactivate_comment')
    
        let data = await query
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})


module.exports = forumRoute
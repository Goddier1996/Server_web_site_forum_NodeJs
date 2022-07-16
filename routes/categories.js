const express = require('express')
const sql = require('mssql') //Sql גישה ל 
const config = require('../utils/config') // ../utils/config גישה לתיקיית 
const multer = require('multer') // קשור להעלאת תמונה
const path = require("path");



const storage = multer.diskStorage({
    destination: "uploads/categories", // היכן התמונות יישמרו - באיזו תיקייה 
    filename: function (req, file, cb) {
        cb(null, "category-" + Date.now() + path.extname(file.originalname)); //כיצד שם התמונה מופיעה בתוך התיקייה 
    }
});

const upload = multer({ // שלמעלה storage העלאת תמונה לאחר יצירת משתנה 
    storage: storage
})



// router עיבוד דינאמי לכל 
let forumRoute = express.Router()




// הצגת כל הקטגוריות
forumRoute.get('/', async (req, res) => {

    try {
        let db = await sql.connect(config.db)

        let query = await db.request().execute('Select_category')

        let data = await query.recordset //recordset = שליפת נתונים 
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})




// הצגת קטגוריות שנמחקו
forumRoute.get('/show', async (req, res) => {

    try {
        let db = await sql.connect(config.db)

        let query = await db.request().execute('Show_categories_Deleted')

        let data = await query.recordset
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})




// הצגת קטגוריה ספציפית לפי מספר סידורי של קטגוריה
forumRoute.get('/:id', async (req, res) => {

    try {
        let params = req.params

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Serial_code', sql.Int, params.id)
            .execute('Select_category_by_serialcode_category')

        let data = await query.recordset;
        res.send(data)


    } catch (error) {
        res.send(error)
    }
})







// הצגת נושא לפי קוד קטגוריה אליו הוא משויך
forumRoute.get('/:id/topics', async (req, res) => {

    try {
        let params = req.params

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Category_code', sql.Int, params.id)
            .execute('Select_topics_by_category')

        let data = await query.recordset
        res.send(data)


    } catch (error) {
        res.send(error)
    }
})






// לא השתמשנו
forumRoute.get('/:id/topicsDeletdByCategory', async (req, res) => {

    try {
        let params = req.params

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Category_code', sql.Int, params.id)
            .execute('Select_topics_deleted_by_category')

        let data = await query.recordset
        res.send(data)


    } catch (error) {
        res.send(error)
    }
})



// forumRoute.get('/:id', async (req, res) => {

//     try {
//         let params = req.params

//         let db = await sql.connect(config.db)

//         let query = await db.request()
//             .input('Category_code', sql.Int, params.id)
//             .execute('Select_topics_by_category')

//         let data = await query.recordset
//         res.send(data)

//     } catch (error) {
//         res.send(error)
//     }
// })





// הוספת קטגוריה
forumRoute.post('/add', async (req, res) => {

    try {
        let body = req.body;

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Name_category', sql.NVarChar(150), body.Name_category)
            .input('Photo', sql.Text, body.Photo)
            .output('Serial_code', sql.Int)
            .execute('Add_category')

        let data = await query.result
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})




// עדכון קטגוריה
forumRoute.put('/update/:id', async (req, res) => {

    try {
        let params = req.params
        let body = req.body

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Serial_code', sql.Int, params.id)
            .input('Name_category', sql.NVarChar(150), body.Name_category)
            .input('Photo', sql.Text, body.Photo)
            .execute('Update_category')

        let data = await query
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})



// מחיקת קטגוריה לפי מספר סידורי של קטגוריה
forumRoute.delete('/delete/:id', async (req, res) => {

    try {
        let params = req.params

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Serial_code', sql.Int, params.id)
            .execute('Delete_category')

        let data = await query
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})




// put - עדכון קטגוריה למצב פעיל ממצב לא פעיל
forumRoute.put('/reactivate/:id', async (req, res) => {

    try {
        let params = req.params

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Serial_code', sql.Int, params.id)
            .execute('Reactivate_category')

        let data = await query
        res.send(data)

    } catch (error) {
        res.send(error)
    }

})



// העלאת תמונה
forumRoute.post('/upload', upload.single('photo'), (req, res, next) => {
    const file = req.file

    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        res.send({ img: null });
    }
    // res.send(file)
    let fullUrl = req.protocol + '://' + req.get('host'); // פרוטוקול תמונה

    res.send({ img: `${fullUrl}/uploads/categories/${file.filename}` });
})



module.exports = forumRoute //הספציפי הזה route ייצוא ה
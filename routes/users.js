const express = require('express')
const sql = require('mssql')
const config = require('../utils/config')
const multer = require('multer') // קשור להעלאת תמונה
const path = require("path");


const storage = multer.diskStorage({
    destination: "uploads/users",
    filename: function (req, file, cb) {
        cb(null, "user-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
})

let forumRoute = express.Router()






forumRoute.get('/', async (req, res) => {

    try {
        let db = await sql.connect(config.db)

        let query = await db.request().execute('select_user')

        let data = await query.recordset
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})






forumRoute.get('/show', async (req, res) => {

    try {
        let db = await sql.connect(config.db)

        let query = await db.request().execute('Show_users_Deleted')

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
            .input('User_code', sql.Int, params.id)
            .execute('Select_user_by_usercode')

        let data = await query.recordset
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})







forumRoute.post('/add', async (req, res) => {

    try {
        let body = req.body;

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('Birthday', sql.Date, body.Birthday)
            .input('City', sql.NVarChar(20), body.City)
            .input('FirstName', sql.NVarChar(20), body.FirstName)
            .input('LastName', sql.NVarChar(20), body.LastName)
            .input('Id', sql.Int, body.Id)
            .input('UserTypeCode', sql.Int, body.UserTypeCode)
            .input('Photo', sql.Text, body.Photo)
            .input('Email', sql.NVarChar(30), body.Email)
            .input('ConfirmPassword', sql.NVarChar(20), body.ConfirmPassword)
            .input('UserPassword', sql.NVarChar(20), body.Password)
            .output('UserCode', sql.Int)
            .execute('Add_user')

        let data = await query.output
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})





forumRoute.put('/update/:id', async (req, res) => {

    try {

        let params = req.params
        let body = req.body

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('User_code', sql.Int, params.id)
            .input('Birthday', sql.Date, body.Birthday)
            .input('City', sql.NVarChar(20), body.City)
            .input('First_name', sql.NVarChar(20), body.First_name)
            .input('Last_name', sql.NVarChar(20), body.Last_name)
            .input('Id', sql.Int, body.Id)
            .input('UserType_code', sql.Int, body.UserType_code)
            .input('Photo', sql.Text, body.Photo)
            .input('Email', sql.NVarChar(30), body.Email)
            .input('Confirm_password', sql.NVarChar(20), body.Confirm_password)
            .input('User_password', sql.NVarChar(20), body.User_password)
            .execute('Update_user')

        let data = await query
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})





forumRoute.put('/updatePassword/:id', async (req, res) => {

    try {

        let params = req.params
        let body = req.body

        let db = await sql.connect(config.db)

        let query = await db.request()
            .input('User_code', sql.Int, params.id)
            .input('Confirm_password', sql.NVarChar(20), body.Confirm_password)
            .input('User_password', sql.NVarChar(20), body.User_password)
            .execute('Update_new_password')

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
            .input('user_code', sql.Int, params.id)
            .execute('delete_user')

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
            .input('user_code', sql.Int, params.id)
            .execute('reactivate_user')

        let data = await query
        res.send(data)

    } catch (error) {
        res.send(error)
    }
})






forumRoute.post('/login', async (req, res) => {

    try {
        let body = req.body;

        let db = await sql.connect(config.db);

        let query = await db.request()
            .input("Email", sql.NVarChar, body.Email)
            .input("Password", sql.NVarChar, body.Password)
            .execute("Login_user");

        let data = query.recordset[0]; //  מערך אובייקטים - משתמש ספציפי מתחבר 
        console.log(data);
        res.send(data);


    } catch (error) {
        res.send(error)
    }
})




//שלו על מנת לעדכן את הסיסמא שלו id מציאת המשתמש ע"י ה
forumRoute.post('/forget', async (req, res) => {

    try {
        let body = req.body;
      
        let db = await sql.connect(config.db);

        let query = await db.request()
            .input("Id", sql.NVarChar, body.Id)
            .execute("Find_user_forget");

        let data = query.recordset[0]; //מערך אובייקטים
        console.log(data);
        res.send(data);


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
    let fullUrl = req.protocol + '://' + req.get('host');

    res.send({ img: `${fullUrl}/uploads/users/${file.filename}` });
})




module.exports = forumRoute



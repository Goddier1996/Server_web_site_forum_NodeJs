// Sql יצירת התחברות עם ה 
module.exports = {
    db: {
        user: process.env.DB_User,
        password: process.env.DB_Password,
        server: process.env.DB_Server,
        database: process.env.DB_Data_Base,
        options: {
            enableArithAbort: true,
            trustServerCertificate: true
        }
    },
}
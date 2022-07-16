//load the modules
const express = require(`express`) // html עיבוד דינאמי של דפי 
const cors = require(`cors`) // בקשות מותאמות אישית
const http = require(`http`) // כתובת האתר
const path = require(`path`) // אחראי בכל מה שקשור לתיקיות


//global vars
const PORT = process.env.PORT || 5000   // הגדרת הכתובת עליה אנו עובדים -> 5000
process.setMaxListeners(100)


//create the server app -> use the modules
let app = express()
app.use(cors())
app.use(express.json()) // יצירת האובייקטים לאחר העיבוד



//create static folder with read access
app.use(express.static(__dirname + '/build/')) //יצירת תיקייה סטטית - משתנה 
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))) //יצירת תיקייה שבה יישמרו התמונות שהעלנו



//routes
//require = מודולים הם דרך לפצל יישום לקבצים נפרדים במקום שכל היישום יהיה בקובץ אחד
app.use('/api/categories', require('./routes/categories'))
app.use('/api/users', require('./routes/users'))
app.use('/api/topics', require('./routes/topics'))
app.use('/api/comments', require('./routes/comments'))
app.use('/api/types_users', require('./routes/types_users'))



//send back the index.html in the static "build" folder
app.get(`/*`, (req, res) => res.sendFile(path.join(__dirname))) 

//apply the http server -> use the http
const server = http.createServer(app)

//run the server
server.listen(PORT, () => { console.log(`the server is live at http://localhost:${PORT}`) })



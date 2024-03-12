const express = require('express')
const app = express()
const port = 5000
const mongoDb = require("./db")

app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
})

mongoDb();

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.use(express.json())
app.use('/api', require('./routes/CrtUser'));
app.use('/api', require('./routes/CourseBackend'));
app.use('/api', require('./routes/StudentBackend'));
app.use('/api', require('./routes/AdminBackend'));
app.use('/api', require('./routes/FacultyBackend'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
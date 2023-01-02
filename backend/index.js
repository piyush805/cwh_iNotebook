const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');
connectToMongo();

const app = express();
const port = 5000;//on 3000, there will be react app


app.use(cors())
app.use(express.json());//to be able to make send request body
// Availble routes
app.use('/api/auth/', require('./routes/auth'))
app.use('/api/notes/', require('./routes/notes'))


app.listen(port, () => {
    console.log(`iNotebook backend listening at http://localhost:${port}`)
})

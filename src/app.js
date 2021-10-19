const express = require('express');
const app = express();
const router = express.Router().checkTables;
const db = require('./db');

//routes
const index = require('./routes/index');
const usersRoute = require('./routes/usersRoute');
const productsRoute = require('./routes/productsRoute');
app.use(express.json());
app.use('/api/', index);
app.use('/api/users', usersRoute);
app.use('/api/products', productsRoute);
app.get('*', function (req, res) {
    res.status(404).send();
});
//end routes
db.checkTables();
module.exports = app;
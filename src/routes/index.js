const express = require('express');
const router = express.Router();
const db = require('../db').pool;
router.get('/', function (req, res, next) {
    db.getConnection((error, conn) => {
        let status_service = "Online";
        if(error) {
            status_service = "Offline";
        }
        res.status(200).send({
            title: process.env.APP_NAME,
            version: process.env.APP_VERSION,
            status: status_service
        });
    });
   
});
module.exports = router;
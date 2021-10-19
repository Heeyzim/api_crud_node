const moment = require('moment');
const db = require('../db').pool;
exports.create = (req, res, next) => {
    if (req.body) {
        if (req.body.name && req.body.birthdate) {
            db.getConnection((error, conn) => {
                if (error) {
                    errorDatabase(error, res);
                    return;
                }
                let sql = "INSERT INTO Users (`name`, `birthdate`, `createdAt`, `updatedAt`) VALUES (?,?,?,?);";
                let values = [
                    req.body.name,
                    req.body.birthdate,
                    moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                    moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                ];
                conn.query(sql, values, (error, result, fields) => {
                    conn.release();
                    if (error) {
                        errorDatabase(error, res);
                        return;
                    }
                    res.status(201).send();
                })
            });
        } else {
            res.status(400).send();
        }
    } else {
        res.status(400).send();
    }
};
exports.update = (req, res, next) => {
    let id = req.params.id;
    if (id && req.body.name && req.body.birthdate) {
        db.getConnection((error, conn) => {
            if (error) {
                errorDatabase(error, res);
                return;
            }
            conn.release();
            let updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
            conn.query('UPDATE Users SET `name` = ?, `birthdate` = ?, `updatedAt` = ? WHERE `id` = ?;', [req.body.name, req.body.birthdate, updatedAt, id], (error, result, fields) => {
                if (error) {
                    errorDatabase(error, res);
                    return;
                }
                res.status(204).send();
            });
        })
        return;
    }
    res.status(400).send();
};
exports.delete = (req, res, next) => {
    let id = req.params.id;
    if (!id) {
        res.status(400).send();
        return;
    }
    db.getConnection((error, conn) => {
        if (error) {
            errorDatabase(error, res);
            return;
        }
        let dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
        conn.query("SELECT * FROM Users WHERE id = ? AND deletedAt IS NULL", id, (error, result, fields) => {
            conn.release();
            if (error) {
                errorDatabase(error, res);
                return;
            }
            if (result.length == 0) {
                res.status(404).send();
                return;
            } else {
                conn.query("UPDATE Users SET `deletedAt` = ?, `updatedAt` = ? WHERE id = ?", [dateNow, dateNow, id], (error, result, fields) => {
                    if (error) {
                        res.status(500).send({
                            error: error,
                            response: null
                        });
                        return;
                    }
                    res.status(204).send();
                });
            }
        });

    })

};
exports.user = (req, res, next) => {
    let id = req.params.id;
    db.getConnection((error, conn) => {
        if (error) {
            errorDatabase(error, res);
            return;
        }
        conn.query('SELECT * FROM Users WHERE id = ? AND `deletedAt` IS NULL;', id, (error, result, fields) => {
            conn.release();
            if (error) {
                errorDatabase(error, res);
                return;
            }
            if (result.length == 0) {
                res.status(404).send();
                return;
            }
            let user = result[0]
            user.birthdate = moment(user.birthdate).format('YYYY-MM-DD');
            user.createdAt = moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss");
            user.updatedAt = moment(user.updatedAt).format("YYYY-MM-DD HH:mm:ss");
            res.status(200).json(user);

        })
    });
}
exports.users = (req, res, next) => {
    db.getConnection((error, conn) => {
        if (error) {
            errorDatabase(error, res);
            return;
        }
        conn.query('SELECT * FROM Users WHERE `deletedAt` IS NULL;', (error, result, fields) => {
            conn.release();
            if (error) {
                errorDatabase(error, res);
                return;
            }
            let users = result;
            users.forEach(function (user) {

                user.birthdate = moment(user.birthdate).format('YYYY-MM-DD');
                user.createdAt = moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss");
                user.updatedAt = moment(user.updatedAt).format("YYYY-MM-DD HH:mm:ss");
            });
            res.status(200).json(users);

        })
    });
}

function errorDatabase(error, res) {
    res.status(500).send({
        error: "Erro inesperado!",
        response: null
    });
    return;
}
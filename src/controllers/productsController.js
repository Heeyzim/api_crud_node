const moment = require('moment');
const db = require('../db').pool;
exports.create = (req, res, next) => {
    if (!req.body) {
        res.status(400).send();
    }
    if (req.body.name && req.body.description && req.body.userId) {
        db.getConnection((error, conn) => {
            if (error) {
                errorDatabase(error, res);
                return;
            }
            conn.query("SELECT * FROM Users WHERE id = ? AND deletedAt IS NULL", req.body.userId, (error, result, fields) => {
                if (error) {
                    errorDatabase(error, res);
                    return;
                }
                if (result.length == 0) {
                    res.status(400).send();
                    return;;
                }
                let values = [
                    req.body.name,
                    req.body.description,
                    req.body.userId,
                    moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                    moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                ];
                conn.query("INSERT INTO Products (`name`, `description`, `userId`, `createdAt`, `updatedAt`) VALUES (?,?,?,?,?);", values, (error, result, fields) => {
                    if (error) {
                        errorDatabase(error, res);
                        return;
                    }
                    res.status(201).send();
                })
            });

            conn.release();
        });
    } else {
        res.status(400).send();
    }
};
exports.update = (req, res, next) => {
    let id = req.params.id;
    if (id && req.body.name && req.body.description && req.body.userId) {
        db.getConnection((error, conn) => {
            if (error) {
                errorDatabase(error, res);
                return;
            }
            conn.release();
            conn.query("SELECT * FROM Users WHERE id = ? AND deletedAt IS NULL", req.body.userId, (error, result, fields) => {
                if (error) {
                    errorDatabase(error, res);
                    return;
                }
                if (result.length == 0) {
                    res.status(400).send();
                    return;;
                }
                let updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
                conn.query('UPDATE Products SET `name` = ?, `description` = ?, `userId` = ?, `updatedAt` = ? WHERE `id` = ?;', [req.body.name, req.body.description, req.body.userId, updatedAt, id], (error, result, fields) => {
                    if (error) {
                        errorDatabase(error, res);
                        return;
                    }
                    res.status(204).send();
                });
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
        conn.query("SELECT * FROM Products WHERE id = ? AND deletedAt IS NULL", id, (error, result, fields) => {
            conn.release();
            if (error) {
                errorDatabase(error, res);
                return;
            }
            if (result.length == 0) {
                res.status(404).send();
                return;
            } else {
                conn.query("UPDATE Products SET `deletedAt` = ?, `updatedAt` = ? WHERE id = ?", [dateNow, dateNow, id], (error, result, fields) => {
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
exports.product = (req, res, next) => {
    let id = req.params.id;
    db.getConnection((error, conn) => {
        if (error) {
            errorDatabase(error, res);
            return;
        }
        conn.query('SELECT * FROM Products WHERE id = ? AND `deletedAt` IS NULL;', id, (error, result, fields) => {
            conn.release();
            if (error) {
                errorDatabase(error, res);
                return;
            }
            if (result.length == 0) {
                res.status(404).send();
                return;
            }
            let product = result[0]
            product.createdAt = moment(product.createdAt).format("YYYY-MM-DD HH:mm:ss");
            product.updatedAt = moment(product.updatedAt).format("YYYY-MM-DD HH:mm:ss");
            res.status(200).json(product);

        })
    });
}
exports.products = (req, res, next) => {

    db.getConnection((error, conn) => {
        if (error) {
            errorDatabase(error, res);
            return;
        }
        conn.query('SELECT * FROM Products WHERE `deletedAt` IS NULL;', (error, result, fields) => {
            conn.release();
            if (error) {
                errorDatabase(error, res);
                return;
            }
            let products = result;
            products.forEach(function (product) {

                product.createdAt = moment(product.createdAt).format("YYYY-MM-DD HH:mm:ss");
                product.updatedAt = moment(product.updatedAt).format("YYYY-MM-DD HH:mm:ss");
            });
            res.status(200).json(products);

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
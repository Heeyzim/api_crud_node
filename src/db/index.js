const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    timezone: 'local'
});
const db_name = process.env.DB_DATABASE;
function checkTables() {
    pool.getConnection((error, conn) => {
        if (error) {
            console.log(error);
            return;
        }
        let createDatabase = `CREATE DATABASE IF NOT EXISTS ${db_name}`;
        conn.query(createDatabase, (error, result, fields) => {
            if (error) {
                console.log(error);
                return;
            }
        });
        conn.query(`use ${db_name}`, (error, result) => {
            if (error) {
                console.log(error);
                return;
            }
        })
        let createTableUsers = `CREATE TABLE IF NOT EXISTS ${db_name}.Users (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                birthdate DATETIME(6) NOT NULL,
                createdAt DATETIME(6) NOT NULL,
                updatedAt DATETIME(6) NOT NULL,
                deletedAt DATETIME(6) NULL DEFAULT NULL,
                PRIMARY KEY (id)
            );`
        conn.query(createTableUsers, (error, result, fields) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log("Database API Criado com sucesso!");
        });

        let createTableProducts = `CREATE TABLE IF NOT EXISTS ${db_name}.Products (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                description LONGTEXT NOT NULL,
                userId INT NOT NULL,
                createdAt DATETIME(6) NOT NULL,
                updatedAt DATETIME(6) NOT NULL,
                deletedAt DATETIME(6) NULL DEFAULT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (userId) REFERENCES users(id)
            );
          `;
        conn.query(createTableProducts, (error, result, fields) => {
            if (error) {
                console.log(error);
                return;
            }

        });
        conn.release();
    });
};
//module.exports.pool = pool;

module.exports = {
    pool: pool,
    checkTables: checkTables
}
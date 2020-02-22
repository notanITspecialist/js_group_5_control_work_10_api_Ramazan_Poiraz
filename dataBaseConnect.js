const mysql = require('promise-mysql');
const config = require('./config');

let connection;

const connect = async () => {
    connection = await mysql.createConnection(config.mysqlOption);
};

const disconnect = () => {
    connection.end();
};

module.exports = {
    connect,
    disconnect,
    appealConnection: () => connection
};
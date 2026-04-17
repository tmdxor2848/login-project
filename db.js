const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Korea123!',
    database: 'login_db'
});

db.connect((err) => {
    if (err) {
        console.error('DB 연결 실패:', err);
        return;
    }
    console.log('DB 연결 성공');
});

module.exports = db;
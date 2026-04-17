const express = require('express');
const app = express();
const port = 3000;

const path = require('path');
const db = require('./db');

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// 회원 가입 화면으로
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.use(express.urlencoded({ extended: true }));


// 회원가입

// 아이디 중복확인
app.get('/check-id', (req, res) => {
    const { userid } = req.query;

    const sql = 'SELECT * FROM users WHERE userid = ?';

    db.query(sql, [userid], (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ exists: false });
        }

        if (result.length > 0) {
            return res.json({ exists: true });
        } else {
            return res.status(500).json({ exists: false });
        }
    });
});


app.post('/signup', (req, res) => {
    const { userid, password, confirm, name, sex, email } = req.body;

    if (password !== confirm) {
        return res.send('비밀번호가 일치하지 않습니다.');
    }

    const sql = `
        INSERT INTO users (userid, password, name, sex, email)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [userid, password, name, sex, email], (err, result) => {
        if (err) {
            console.error('회원가입 저장 오류:', err);
            return res.send('회원가입 실패');
        }

        console.log('저장 성공:', result);
        res.send('회원가입 완료');
    });
});
// app.post('/signup', (req, res) => {
//     const { userid, password, confirm, name, sex, email } = req.body;

//     if (password !== confirm) {
//         return res.send('비밀번호가 일치하지 않습니다.');
//     }

//     console.log(userid, password, name, sex, email);
//     res.send('회원가입 완료');
// });



// 동작 확인
app.listen(port, () => {
    console.log(`port ${port}`);
});
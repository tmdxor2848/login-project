const express = require('express');
const app = express();
const port = 3000;

const path = require('path');
const db = require('./db');

const bcrypt = require('bcrypt');

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'main.html'));
});
app.get('/signup_success', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup_success.html'));
});



app.post('/login', (req, res) => {
    const { userid, password } = req.body;

    const sql = 'SELECT * FROM users WHERE userid = ?';

    db.query(sql, [userid], async (err, result) => {
        if (err) {
            console.error(err);
            return res.send('서버 오류');
        }

        // 1️⃣ 아이디 없음
        if (result.length === 0) {
            return res.send('아이디가 존재하지 않습니다.');
        }

        const user = result[0];

        // 2️⃣ 비밀번호 비교
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send('비밀번호가 틀렸습니다.');
        }

        // 3️⃣ 로그인 성공
        res.redirect('/main');
    });
});

// 회원 가입 화면으로
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});




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
            return res.json({ exists: false });
        }
    });
});


app.post('/signup', async (req, res) => {
    const { userid, password, confirm, name, sex, email } = req.body;

    if (password !== confirm) {
        return res.send('비밀번호가 일치하지 않습니다.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (userid, password, name, sex, email)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(sql, [userid, hashedPassword, name, sex, email], (err, result) => {
            if (err) {
                console.error('회원가입 저장 오류:', err);
                return res.send('회원가입 실패');
            }

            console.log('저장 성공:', result);
            res.redirect('/signup_success');
        });
    } catch (error) {
        console.error(error);
        res.send('암호화 오류')
    }
});
// app.post('/signup', (req, res) => {
//     const { userid, password, confirm, name, sex, email } = req.body;

//     if (password !== confirm) {
//         return res.send('비밀번호가 일치하지 않습니다.');
//     }

//     console.log(userid, password, name, sex, email);
//     res.send('회원가입 완료');
// });


app.get('/order_btn', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'order_btn.html'));
});


// 동작 확인
app.listen(port, () => {
    console.log(`port ${port}`);
});
const express = require('express');

const router = express.Router();
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const User = require('../Models/User');
const Post = require('../Models/Post');
const verifyToken = require('../middleware/auth')

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');// gửi lẹnh lên sv truy xuất theo id và chỉ lấy pass
        if (!user) return res.status(400).json({ success: false, message: 'ko nhan user' });
        res.json({ succes: true, user });
    } catch (error) {
        console.log(error);
    }
})



router.post('/login', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400)
            .json({ success: false, message: 'Sai ten dang nhap hoac mat khau' })
    }
    try {
        const user = await User.findOne({ username })
        if (!user) return res.status(400)
            .json({ success: false, message: 'Sai ten dang nhap ' })
        const passValid = await argon2.verify(user.password, password)
        if (!passValid) return res.status(400)
            .json({ success: false, message: 'Sai mat khau' })


        const accesstoken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET)
        res.json({ success: true, message: 'user dang nhap thanh cong', accesstoken });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'loi ko xac dinh' })
    }
});


router.post('/register', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400)
            .json({ success: false, message: 'Thieu ten dang nhap hoac mat khau' })
    }
    try {
        const user = await User.findOne({ username })
        if (user) return res.status(400)
            .json({ success: false, message: ' ten dang nhap da ton tai' })

        const hashedPassword = await argon2.hash(password);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        const accesstoken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET)
        res.json({ success: true, message: 'da tao user thanh cong', accesstoken });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'loi ko xac dinh' })
    }
});


module.exports = router;
const express = require('express');
var crypto = require('crypto')
const router = express.Router();
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const User = require('../Models/User');
const Class = require('../Models/Class');
const verifyToken = require('../middleware/auth');
const { populate } = require('../Models/User');

router.get('/', async (req, res) => {
    try {
        const classes = await Class.find({ user: req.userId }).populate('user', ['username']);
        res.json({ success: true, classes })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'loi ko xac dinh' })
    }
})

router.post('/', async (req, res) => {
    const { name, topic, room, part, invcode, teacher } = req.body;
    var icode = crypto.randomBytes(3).toString('hex');
    if (!name) res.status(400).json({ success: false, message: 'Ko co tieu de' });
    try {
        const newClass = new Class({
            name, topic, room, part,
            invcode: icode,
            teacher: req.userId

        });
        await newClass.save();

        res.json({ success: true, message: "happy", class: newClass })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'loi ko xac dinh' })
    };

})



module.exports = router
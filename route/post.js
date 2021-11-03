const express = require('express');

const router = express.Router();
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const User = require('../Models/User');
const Post = require('../Models/Post');
const verifyToken = require('../middleware/auth');
const { populate } = require('../Models/User');

router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.userId }).populate('user', ['username']);
        res.json({ success: true, posts })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'loi ko xac dinh' })
    }
})

router.post('/', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;
    if (!title) res.status(400).json({ success: false, message: 'Ko co tieu de' });
    try {
        const newPost = new Post({
            title, description,
            url: (url.startsWith('https://') ? url : `https://${url}`),
            status: status || 'TO LEARN',
            user: req.userId
        });
        await newPost.save();

        res.json({ success: true, message: "happy", post: newPost })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'loi ko xac dinh' })
    };

})
router.put('/:id', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;
    if (!title) res.status(400).json({ success: false, message: 'Ko co tieu de' });
    let updatePost = {
        title,
        description: description || '',
        url: (url.startsWith('https://') ? url : `https://${url}`) || '',
        status: status || 'TO LEARN'
    }
    const postUpdateCondition = { _id: req.params.id, user: req.userId };
    updatePost = await Post.findOneAndUpdate(postUpdateCondition, updatePost, { new: true })
    if (!updatePost) {
        //console.log(error)
        return res.status(401).json({ success: false, message: 'loi post ko tim thay' })
    }
    res.json({ success: true, message: "Excellent", post: updatePost })

})

router.delete('/:id', verifyToken, async (req, res) => {

    try {
        const postDeleteCondition = { _id: req.params.id, user: req.userId };
        deletePost = await Post.findOneAndDelete(postDeleteCondition)
        if (!deletePost) {
            //console.log(error)
            return res.status(401).json({ success: false, message: 'loi post ko tim thay' })
        }
        res.json({ success: true, message: "Đã xóa Post", post: deletePost })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal Server' })
    }

})
module.exports = router
const router = require('express').Router();
const withAuth = require(`../utils/auth.js`);
const { Post, User, Comment } = require('../models');

// Get all your posts for your dashboard
router.get(`/`, /*withAuth,*/ (req, res) => {
    Post.findAll({
        // where: { user_id: req.session.user_id },
        attributes: [`id`, `title`, `created_at`, `post_content`],
        include: [
            {
                model: Comment,
                attributes: [`id`, `comment_text`, `post_id`, `user_id`, `created_at`],
                include: {
                    model: User,
                    attributes: [`username`]
                }
            },
            {
                model: User,
                attributes: [`username`]
            }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));

        res.render(`dashboard`, { posts, loggedIn: true})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get(`/edit/:id`, /*withAuth,*/ (req, res) => {
    Post.findOne({
        where: { id: req.params.id },
        attributes: [`id`, `title`, `created_at`, `post_content`],
        include: [
            {
                model: Comment,
                attributes: [`id`, `comment_text`, `post_id`, `user_id`, `created_at`]
            },
            {
                model: User,
                attributes: [`username`]
            }
        ]
    })
    .then(dbPostData =>{
        if (!dbPostData) {
            res.status(404).json({ message: `No post with this id exists`});
            res.redirect(`/`);
            return;
        }

        const post = dbPostData.get({ plain: true });

        res.render(`edit-post`, { post, loggedIn: true });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
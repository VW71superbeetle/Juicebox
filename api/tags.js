
const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const {tagName} = req.params;
    // read the tagname from the params
    try {
        // use our method to get posts by tag name from the db
        // send out an object to the client { posts: // the posts }
        const posts =  await getPostsByTagName(tagName);
        if (posts){
            res.send({posts});
        }
        next();

    } catch ({ name, message }) {
        next({ name, message });
    }
});

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");
    next(); 
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();
    res.send({
        tags
    });
});

module.exports = tagsRouter;   
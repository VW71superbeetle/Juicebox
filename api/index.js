// Constants
const { JWT_SECRET } = process.env;

// Requires
const express = require('express');
const jwt = require('jsonwebtoken');
const usersRouter = require('./users');
const postsRouter = require('./posts');
const tagsRouter = require('./tags');
const { getUserById } = require('../db');

// Declarations
const apiRouter = express.Router();
apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/tags', tagsRouter);
// Routes
    // set `req.user` if possible

apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    if (!auth) { // nothing to see here
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);

        try {
            const { id } = jwt.verify(token, JWT_SECRET);

            if (id) {
                req.user = await getUserById(id);
                next();
            }
        } catch ({ name, message }) {
            next({ name, message });
        }
    } else {
        next({ 
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${ prefix }`
        });
    }
});   

apiRouter.use((req, res, next) => {
    if (req.user) {
        console.log("User is set:", req.user);
    } 
    next();
});


// Error Handler
apiRouter.use((error, req, res, next) => {
    res.send(error);
});

// Exports
module.exports = apiRouter;



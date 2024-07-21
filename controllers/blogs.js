const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', (req, res) => {
    Blog.find({}).then(notes => {
        res.json(notes)
    })
})

router.get('/:id', (req, res, next) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            if(blog) {
                res.json(blog)
            } else {
                res.status(404).end()
            }
        })
        .catch((error) => next(error))
})

router.post('/', (req, res, next) => {
    const { title, author, url, likes } = req.body;

    const blog = new Blog({
        title,
        author,
        url,
        likes,
    })

    blog.save()
        .then((saved) => {
            res.json(saved)
        })
        .catch((error) => next(error))
})

router.delete('/:id', (req, res, next) => {
    Blog.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch((error) => next(error))

})

router.put('/:id', (req, res, next) => {
    const { title, author, url, likes } = req.body;
    const blog = { title, author, url, likes }

    Blog.findByIdAndUpdate(
        req.params.id, 
        blog, {
            new: true,
            runValidators: true,
            context: 'query'
        })
        .then((updated) => {
            res.send(updated)
        })
        .catch((error) => next(error))
})

module.exports = router



const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs);
})

router.get('/:id', async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id)

        if(blog) {
            res.json(blog)
        } else {
            res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    const { title, author, url, likes } = req.body;

    const blog = new Blog({
        title,
        author,
        url,
        likes,
    })

    if (!title) {
        return res.status(400).json({
            error: 'Title is missing'
        }).end();
    }

    try {
        const result = await blog.save()
        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        await Blog.findByIdAndDelete(req.params.id)

        res.status(204).end()
    } catch(error) { 
        next(error) 
    }

})

router.put('/:id', async (req, res, next) => {
    const { title, author, url, likes } = req.body;
    const blog = { title, author, url, likes }

    try {
        const result = await Blog.findByIdAndUpdate(
            req.params.id, 
            blog, {
                new: true,
                runValidators: true,
                context: 'query'
            })

        res.send(result)
    } catch (error) {
        next(error)
    }
})

module.exports = router



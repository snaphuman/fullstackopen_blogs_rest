const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs);
})

router.get('/:id', async (req, res) => {
        const blog = await Blog.findById(req.params.id)

        if(blog) {
            res.json(blog)
        } else {
            res.status(404).end()
        }
})

router.post('/', async (req, res) => {
    const { title, author, url, likes } = req.body;

    const blog = new Blog({
        title,
        author,
        url,
        likes,
    })

        const result = await blog.save()
        res.status(201).json(result)
})

router.delete('/:id', async (req, res) => {
        await Blog.findByIdAndDelete(req.params.id)

        res.status(204).end()
})

router.put('/:id', async (req, res) => {
    const { title, author, url, likes } = req.body;
    const blog = { title, author, url, likes }

        const result = await Blog.findByIdAndUpdate(
            req.params.id, 
            blog, {
                new: true,
                runValidators: true,
                context: 'query'
            })

        res.send(result)
})

module.exports = router



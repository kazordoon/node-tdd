import express from 'express'
import PostsController from '../controllers/posts'
import Post from '../models/posts'

const router = express.Router()

const postsController = new PostsController(Post)

router.get('/', (req, res) => postsController.findAll(req, res))
router.get('/:id', (req, res) => postsController.getById(req, res))
router.post('/', (req, res) => postsController.create(req, res))
router.put('/:id', (req, res) => postsController.update(req, res))
router.delete('/:id', (req, res) => postsController.delete(req, res))

export default router

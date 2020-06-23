import express from 'express'
import usersRoute from './users'
import postsRoute from './posts'

const router = express.Router()

router.use('/users', usersRoute)
router.use('/posts', postsRoute)
router.get('/', (req, res) => res.send('Hello World!'))

export default router

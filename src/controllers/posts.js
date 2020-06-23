class PostsController {
  constructor (Post) {
    this.Post = Post
  }

  async findAll (req, res) {
    try {
      const posts = await this.Post.find({})
      res.send(posts)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  async getById (req, res) {
    const { params: { id } } = req

    try {
      const post = await this.Post.find({ _id: id })
      res.send(post)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  async create (req, res) {
    try {
      const post = new this.Post(req.body)
      await post.save()

      res.status(201).send(post)
    } catch (error) {
      res.status(422).send(error.message)
    }
  }

  async update (req, res) {
    const body = req.body

    try {
      const post = await this.Post.findById(req.params.id)

      post.firstName = body.firstName
      post.lastName = body.lastName
      post.email = body.email

      await post.save()

      res.sendStatus(200)
    } catch (error) {
      res.status(422).send(error.message)
    }
  }

  async delete (req, res) {
    try {
      await this.Post.deleteOne({ _id: req.params.id })
      res.sendStatus(204)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }
}

export default PostsController

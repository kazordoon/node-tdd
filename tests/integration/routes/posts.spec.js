import Post from '../../../src/models/posts'

describe('Routes: Posts', () => {
  const defaultId = '56cb91bdc3464f14678934ca'
  const defaultPost = {
    title: 'My post title',
    content: 'My post content',
    author: 'John Doe',
    publishDate: '2019-01-01T00:00:00.000Z',
    createdAt: '2019-01-01T00:00:00.000Z',
    updatedAt: '2019-01-01T00:00:00.000Z'
  }

  const expectedPost = {
    _id: defaultId,
    ...defaultPost
  }

  beforeEach(async () => {
    const post = new Post(defaultPost)
    post._id = defaultId

    await Post.deleteMany({})
    await post.save()
  })

  afterEach(() => Post.deleteMany({}))

  describe('GET /posts', () => {
    it('should return a list of posts', async () => {
      const response = await request.get('/posts')

      expect(response.body).to.eql([expectedPost])
    })

    context('when an id is specified', () => {
      it('should return 200 with one post', async () => {
        const response = await request.get(`/posts/${defaultId}`)

        expect(response.statusCode).to.eql(200)
        expect(response.body).to.eql([expectedPost])
      })
    })
  })

  describe('POST /posts', () => {
    context('when posting an post', () => {
      it('should return a new post with status code 201', async () => {
        const customId = '56cb91bdc3464f14678934ba'
        const newPost = {
          ...expectedPost,
          _id: customId,
          title: 'My new post title',
          content: 'My new post content',
          author: 'Foo Bar',
          publishDate: defaultPost.publishDate
        }
        const expectedSavedPost = {
          ...defaultPost,
          ...newPost
        }

        const response = await request.post('/posts').send(newPost)

        expect(response.statusCode).to.eql(201)
        expect(response.body).to.eql(expectedSavedPost)
      })
    })
  })

  describe('PUT /posts/:id', () => {
    context('when editing an post', () => {
      it('should update the post and return 200 as status code', async () => {
        const customPost = {
          title: 'My updated post title'
        }
        const updatedPost = {
          ...defaultPost,
          customPost
        }

        const response = await request.put(`/posts/${defaultId}`).send(updatedPost)

        expect(response.status).to.eql(200)
      })
    })
  })

  describe('DELETE /posts/:id', () => {
    context('when deleting an post', () => {
      it('should delete an post and return 204 as status code', async () => {
        const response = await request.delete(`/posts/${defaultId}`)

        expect(response.status).to.eql(204)
      })
    })
  })
})

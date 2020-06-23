import sinon from 'sinon'

import PostsController from '../../../src/controllers/posts'
import Post from '../../../src/models/posts'

describe('Controller: Posts', () => {
  const defaultPost = [{
    id: '5ef21ab7c260d210f7b46e7a',
    title: 'My post title',
    content: 'My post content',
    author: 'John Doe',
    publishDate: new Date()
  }]

  const defaultRequest = {
    params: {}
  }

  describe('findAll() posts', () => {
    it('should call send with a list of posts', async () => {
      const response = {
        send: sinon.spy()
      }

      Post.find = sinon.stub()
      Post.find.withArgs({}).resolves(defaultPost)

      const postsController = new PostsController(Post)
      await postsController.findAll(defaultRequest, response)

      sinon.assert.calledWith(response.send, defaultPost)
    })

    it('should return 400 when an error occurs', async () => {
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      }

      response.status.withArgs(400).returns(response)

      Post.find = sinon.stub()
      Post.find.withArgs({}).rejects({ message: 'Error' })

      const postsController = new PostsController(Post)
      await postsController.findAll(defaultRequest, response)

      sinon.assert.calledWith(response.send, 'Error')
    })
  })

  describe('getById()', () => {
    it('should call send with one post', async () => {
      const fakeId = 'a-fake-id'
      const request = {
        params: {
          id: fakeId
        }
      }
      const response = {
        send: sinon.spy()
      }

      Post.find = sinon.stub()
      Post.find.withArgs({ _id: fakeId }).resolves(defaultPost)

      const postsController = new PostsController(Post)
      await postsController.getById(request, response)

      sinon.assert.calledWith(response.send, defaultPost)
    })
  })

  describe('create() post', () => {
    it('should call send with a new post', async () => {
      const requestWithBody = {
        body: defaultPost[0],
        ...defaultRequest
      }
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      }

      class FakePost {
        save () { }
      }

      response.status.withArgs(201).returns(response)

      sinon.stub(FakePost.prototype, 'save').withArgs().resolves()

      const postsController = new PostsController(FakePost)
      await postsController.create(requestWithBody, response)

      sinon.assert.calledWith(response.send)
    })

    context('when an error occurs', () => {
      it('should return 422', async () => {
        const response = {
          send: sinon.spy(),
          status: sinon.stub()
        }

        class FakePost {
          save () { }
        }

        response.status.withArgs(422).returns(response)

        sinon.stub(FakePost.prototype, 'save').withArgs().rejects({ message: 'Error' })

        const postsController = new PostsController(FakePost)
        await postsController.create(defaultRequest, response)

        sinon.assert.calledWith(response.status, 422)
      })
    })
  })

  describe('update() post', () => {
    const fakeId = 'a-fake-id'
    const updatedPublishDate = new Date()
    updatedPublishDate.setFullYear(updatedPublishDate.getMonth() - 1)

    const updatedPost = {
      _id: fakeId,
      title: 'My updated title',
      content: 'My updated content',
      publishDate: updatedPublishDate
    }

    it('should respond with 200 when the post has been updated', async () => {
      const request = {
        params: {
          id: fakeId
        },
        body: updatedPost
      }
      const response = {
        sendStatus: sinon.spy()
      }

      class FakePost {
        static findById () { }

        save () { }
      }

      const fakePost = new FakePost()
      const saveSpy = sinon.spy(FakePost.prototype, 'save')

      const findByIdStub = sinon.stub(FakePost, 'findById')
      findByIdStub.withArgs(fakeId).resolves(fakePost)

      const postsController = new PostsController(FakePost)
      await postsController.update(request, response)

      sinon.assert.calledWith(response.sendStatus, 200)
      sinon.assert.calledOnce(saveSpy)
    })

    context('when an error occurs', () => {
      it('should return 422', async () => {
        const request = {
          params: {
            id: fakeId
          },
          body: updatedPost
        }
        const response = {
          send: sinon.spy(),
          status: sinon.stub()
        }

        class FakePost {
          static findById () { }
        }

        const findByIdStub = sinon.stub(FakePost, 'findById')
        findByIdStub.withArgs(fakeId).rejects({ message: 'Error' })

        response.status.withArgs(422).returns(response)

        const postsController = new PostsController(FakePost)
        await postsController.update(request, response)

        sinon.assert.calledWith(response.send, 'Error')
      })
    })
  })

  describe('delete() post', () => {
    const fakeId = 'a-fake-id'
    const request = {
      params: {
        id: fakeId
      }
    }

    it('should respond with 204 when the post has been deleted', async () => {
      const response = {
        sendStatus: sinon.spy()
      }

      class FakePost {
        static deleteOne () { }
      }

      const removeStub = sinon.stub(FakePost, 'deleteOne')
      removeStub.withArgs({ _id: fakeId }).resolves([1])

      const postsController = new PostsController(FakePost)
      await postsController.delete(request, response)

      sinon.assert.calledWith(response.sendStatus, 204)
    })

    context('when an error occurs', () => {
      it('should return 400', async () => {
        const response = {
          send: sinon.spy(),
          status: sinon.stub()
        }

        class FakePost {
          static deleteOne () { }
        }

        const removeStub = sinon.stub(FakePost, 'deleteOne')

        removeStub.withArgs({ _id: fakeId }).rejects({ message: 'Error' })

        response.status.withArgs(400).returns(response)

        const postsController = new PostsController(FakePost)

        await postsController.delete(request, response)

        sinon.assert.calledWith(response.send, 'Error')
      })
    })
  })
})

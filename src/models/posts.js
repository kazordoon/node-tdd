import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publishDate: {
    type: Date,
    default: new Date(),
  }
}, {
  versionKey: false,
  timestamps: true
})

const PostModel = mongoose.model('Post', PostSchema)

export default PostModel

import mongoose from 'mongoose'

const InvalidTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('InvalidToken', InvalidTokenSchema)

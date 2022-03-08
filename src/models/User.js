import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    verifiedAt: { type: Date, required: false, default: null },
    addresses: [
      {
        addressLine_1: { type: String, required: true },
        addressLine_2: { type: String, required: false },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zip: { type: String, required: true },
        phone: { type: String, required: true },
        alternatePhone: { type: String, required: false },
        isDefault: { type: Boolean, default: false },
      },
    ],
    emailVerification: {
      token: { type: String, required: false },
      expiresAt: { type: Date, required: false },
    },
    passwordReset: {
      token: { type: String, required: false },
      expiresAt: { type: Date, required: false },
    },
  },
  { timestamps: true }
)

export default mongoose.model('User', UserSchema)

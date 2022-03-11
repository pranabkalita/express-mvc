import multer from 'multer'

/**
 * Prepare storage/location to upload avatar
 */
const multerStorage = multer.diskStorage({
  destination: (req, files, callback) => {
    callback(null, 'public/img/profile')
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split('/')[1]
    callback(null, `profile-${req.user._id}-${Date.now()}.${ext}`)
  },
})

/**
 * Check if the uploaded files are of type image
 */
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true)
  } else {
    callback(new Error('Invalid file uploaded !'), false)
  }
}

/** Prepare file uploader */
const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

export const uploadAvatarImage = upload.fields([
  { name: 'avatar', maxCount: 1 },
])

export const SuccessResponse = (res, code, data) => {
  return res.status(code).json({
    success: true,
    data,
  })
}

export const ErrorResponse = (res, code, data) => {
  return res.status(code).json({
    success: false,
    data,
  })
}

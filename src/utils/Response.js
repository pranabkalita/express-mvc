export const SuccessResponse = (res, code, data) =>
  res.status(code).json({
    success: true,
    data,
  })

export const ErrorResponse = (res, code, data) =>
  res.status(code).json({
    success: false,
    data,
  })

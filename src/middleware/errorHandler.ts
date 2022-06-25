import { ErrorRequestHandler } from "express"
import errorConfigs from "../configs/error"

// 익명 내보내기
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const errMessage: string = err.toString()
  console.error(err)

  let errCode = errMessage.replace("Error: ", "")

  let errConfig = errorConfigs[errCode]
  if (!errConfig) {
    // errConfig가 undefined일 때
    errCode = "E0000"
    errConfig = errorConfigs[errCode]
  }
  const { message, status } = errConfig

  res.status(status)
  res.send({
    errorMessage: message,
  })
}

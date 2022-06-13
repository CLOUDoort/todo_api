import { Request, Response, NextFunction } from "express"
import { connectionWithRunFunction } from "../modules/mysql"
import JWT from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

interface RequestWithConnection extends Request {
  mysqlConnection?: connectionWithRunFunction
}

export const authorizer = (
  req: RequestWithConnection,
  res: Response,
  next: NextFunction
) => {
  const { authorization: bearerToken } = req.headers
  const { mysqlConnection: connection } = req
  const token = bearerToken?.replace("Bearer ", "") || ""

  const SECRET = process.env.JWT_SECRET as string

  let payload = {}
  try {
    payload = JWT.verify(token, SECRET)
  } catch (e) {
    throw new Error("E3000")
  }
  const { id, iat } = payload as any

  connection
    ?.run(`SELECT COUNT(*) AS count FROM users WHERE id = ?;`, [id])
    .then((selectCountResult: { count: number }[]) => {
      const { count } = selectCountResult[0]
      console.log(count)
      if (count >= 1) {
        console.log("auth success")
        next() // 인자값이 없으면 다음 미들웨어
      } else {
        next(new Error("E3000")) // next에 인자값을 넣으면 에러핸들러로
      }
    })
    .catch((e: Error) => {
      next(e)
    })

  //   console.log("payload: ", payload)
  //   //   console.log("authorization:  ", req.headers.authorization)
  //   next()
}

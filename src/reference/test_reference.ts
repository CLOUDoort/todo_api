import express, { Request, Response } from "express"
interface RequestWithConnection extends Request {
  mysqlConnection: any
}

const router = express.Router()

router.get("/err", (req, res) => {
  throw new Error("갑작스러운 에러")
  res.send({
    text: "error",
  })
})

router.post("/async", (req, res, next) => {
  const api = async (req: RequestWithConnection, res: Response) => {
    const connection = req.mysqlConnection
    const selectUserResult = await connection.run(`SELECT * FROM users`)
    return {
      data: selectUserResult,
    }
  }

  api(req as RequestWithConnection, res)
    .then((result) => {
      res.json({
        success: true,
        result: result,
      })
    })
    .catch((e) => {
      next(e)
    })
})

export default router

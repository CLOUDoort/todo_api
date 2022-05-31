import express, { ErrorRequestHandler, Handler } from "express"
import cors from "cors"
import usersRouter from "./api/users"
import userPostsRouter from "./api/users/posts"
import testRouter from "./api/test"
import { useMysql } from "./middleware/useMysql"

const app = express()
const PORT = 3714
// 숫자값, 문자열 등 절대 변하지 않을 값을 참조할 때 대문자로 상수 변수화하는 것이 관례

app.use(express.static("public")) // public이란 폴더에서 정적인 파일을 서비스한다.
app.use(express.urlencoded({ extended: true })) // form 데이터 받아들임, body-parser 포함
app.use(express.json())
app.use(cors())

app.use(useMysql)
app.use("/v1", usersRouter) // 라우터 주소 default값 설정
app.use("/v1", userPostsRouter)
app.use("/test", testRouter)

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.send({
    text: `${err}`,
  })
}

app.use(errorHandler)

app.listen(PORT, () => {
  // 서버가 만들어지는 과정, 굉장히 간단함.
  console.log(`Example app listening at http://localhost:${PORT}`)
})

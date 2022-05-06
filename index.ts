import express from "express"
import cors from "cors"

const app = express()
const PORT = 3714
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// parameter를 보내는 방식 총 3가지
// params, body, query

app.post("/calculate/:num1/:symbol/:num2", (req, res) => {
  const num1 = Number(req.params.num1)
  const num2 = Number(req.params.num2)
  const symbol: any = req.params.symbol

  const calfuncs: { [index: string]: any } = {
    // object형태로 정의할 것이지만 key값들은 string, value값은 any타입으로정의
    plus: (num1: number, num2: number): number => num1 + num2,
    minus: (num1: number, num2: number): number => num1 - num2,
    multiply: (num1: number, num2: number): number => num1 * num2,
    divide: (num1: number, num2: number): number => num1 / num2,
  }

  const result: number = calfuncs[symbol](num1, num2)

  res.json({
    answer: result,
  })
})

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
)

// 1. 계산기 만들기 - METHODS, parameters, 기능 자유
// 2. mini board API 분석하기 - 파일 분석
// 3. todo-list 틀만 만들어보기 - 프론트X, CRUD 구성해보기

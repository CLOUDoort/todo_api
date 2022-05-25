import express from "express"
import cors from "cors"
import fs from "fs/promises"

const app = express()
const PORT = 3714
const DATA_FILE_PATH = "./data/user.json"
// 숫자값, 문자열 등 절대 변하지 않을 값을 참조할 때 대문자로 상수 변수화하는 것이 관례

app.use(express.static("public")) // public이란 폴더에서 정적인 파일을 서비스한다.
app.use(express.urlencoded({ extended: true })) // form 데이터 받아들임, body-parser 포함
app.use(express.json())
app.use(cors())

// data middleware
// => readFileSync 사용 대신, readFile을 async,await을 통해 동기적으로 만들고 활용성을 더 높인다.
// app.use("*", async (req: any, res: any, next: any) => {
//   const data = JSON.parse(await fs.readFile(DATA_FILE_PATH, "utf-8"))
//   req.data = data
//   next()
// })

// READ
app.get("/user", async (req, res) => {
  const fileJSONData = (await fs.readFile(DATA_FILE_PATH)).toString()
  const fileData: filedataType = JSON.parse(fileJSONData)
  res.send(fileData)
})

type filedataType = {
  id: string
  password: string
  name: string
  age: number
}[]
// 타입 중복 -> 타입변수화

// CREATE , body parameter 입력(id, password, name, age)을 받아서 data.json 가장 마지막 index에 추가하기
app.post("/user", async (req, res) => {
  const { id, password, name, age } = req.body // 구조분해할당
  const fileJSONData = (await fs.readFile(DATA_FILE_PATH)).toString() // buffer 데이터로 받고 문자열로 변환
  const fileData: filedataType = JSON.parse(fileJSONData)
  // 위 데이터는 참조용으로 만듬

  console.log(fileData)

  const modifiedFileData: filedataType = [...fileData] // 스프레드 연산자를 쓰는 이유는 배열을 할당하는 것이 아닌 배열을 그대로 복사하기 위함이다.
  // 배열을 할당하게 되면, 새로운 배열이 변할 때 기존의 배열도 변하게 된다. 하지만 이렇게 복사하게 되면 새로운 배열의 값이 변할 때 기존의 배열의 값은 변하지 않는다.
  modifiedFileData.push({ id, password, name, age })
  console.log(modifiedFileData)

  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(modifiedFileData))

  res.send({
    success: true,
  })
})

// UPDATE
app.put("/user", async (req: any, res: any, next: any) => {
  const { id, password, name, age, index } = req.body
  const fileJSONData = (await fs.readFile(DATA_FILE_PATH)).toString()
  const fileData: filedataType = JSON.parse(fileJSONData)

  const modifiedFileData: filedataType = [...fileData]
  modifiedFileData[index] = { id, name, age, password }

  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(modifiedFileData))

  res.send({
    success: true,
  })
})

// DELETE
app.delete("/user", async (req: any, res: any) => {
  const { index } = req.body
  // = const index = req.body.index
  const fileJSONData = (await fs.readFile(DATA_FILE_PATH)).toString()
  const fileData: filedataType = JSON.parse(fileJSONData)

  const modifiedFileData: filedataType = [...fileData]
  modifiedFileData.splice(index, 1) // 인덱스 지점부터 몇개를 삭제할 것인지, 두번째 인자에 넣어줌

  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(modifiedFileData))

  res.send({
    success: true,
  })
})

app.use((req, res, next) => {
  res.status(404).send("Wrong!")
})
// url 경로 이탈

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack)
  res.status(500).send("Broke!")
})
// 종합 에러

app.listen(PORT, () => {
  // 서버가 만들어지는 과정, 굉장히 간단함.
  console.log(`Example app listening at http://localhost:${PORT}`)
})

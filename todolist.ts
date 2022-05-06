import express from "express"
import cors from "cors"
import * as fs from "fs"
import { nextTick } from "process"

const app = express()
const PORT = 3714
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true })) // form 데이터 가공
app.use(express.json()) // json 데이터 가공
app.use(cors())

// pathParams(params), queryParams(queryString) => URL을 통해 정보 전달
// bodyParams => request body에 정보를 담아 전달
// url에 전부 드러나는 queryParams는 사용 자제할 것
// get만 body를 못받음, path와 query만 받음

// READ
app.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data/list.json").toString("utf-8"))
  // 파일을 읽고(readFileSync) 인코딩 옵션처리(utf-8)한 뒤 데이터를 사용하기 위해 객체화(JSON.parse) 한 후 변수 선언
  // readFile은 비동기적 처리이기 때문에 변수 선언 불가, 하지만 readFileSync는 동기적 처리로 변수 선언이 가능
  res.json(data)
  // postman의 api로 보내는 과정
  // res.send와 res.json의 차이점
  // json 응답을 하는 것이라면 res.json이 적절하다. 또한 명시적으로도 res.json이 json데이터를 보낸다는 의미를 더 잘 전달한다.
})

// CREATE / get 이외의 메소드에는 body사용/ 나머지는 정보가 URL에 노출됨
app.post("/create", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data/list.json").toString("utf-8"))
  // 데이터 사용하기 위해 변수 선언
  data.sort((a: any, b: any) => {
    return a.index - b.index
  })
  // 인덱스 정렬
  const list = req.body
  // postman 내에서 내가 추가할 body 데이터
  list.index = data.length === 0 ? 0 : data[data.length - 1].index + 1
  // 추가할 데이터에 index 번호 부여
  data.push(req.body)
  // data array에 postman body data를 push
  // 이전에 data와 push된 data는 다름
  fs.writeFileSync("data/list.json", JSON.stringify(data))
  // list.json에 업데이트된 data를 json파일로 저장
  res.json({ success: true, index: list.index })
  // 성공여부를 api를 통해 확인
})

// UPDATE
app.put("/update", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data/list.json").toString("utf-8"))
  // 데이터 변수 선언
  const list = req.body
  const index = list.index
  const todo = list.todo
  // 수정하려는 리스트의 index값과 todo값
  const target = data.find((o: any) => o.index == index)
  // 데이터의 index와 수정하려는 데이터의 index가 같을 때
  console.log(target) // 객체

  console.log(todo)
  console.log(target)

  target.todo = todo
  // 바뀐 값을 변수에 넣어서 실질적인 data 값에 변화가 없었던 것.
  // 함부로 변수 선언을 하지 말자.

  fs.writeFile("data/list.json", JSON.stringify(data), (err) => {
    if (err) return console.log(err)
    res.json(data)
  })
})

//DELETE
app.delete("/delete", (req, res) => {
  let success = false
  let errorMsg
  const data = JSON.parse(fs.readFileSync("data/list.json").toString("utf-8"))
  const index = req.body.index
  const target = data.find((o: any) => o.index == index)
  // 내가 삭제하려는 todo의 인덱스와 같은 값을 지닌 인덱스를 data에서 찾는다.
  if (target) {
    data.splice(data.indexOf(target), 1)
    // 배열의 요소를 삭제, 교체, 추가해주는 splice함수 사용
    // data에서 target에 해당하는 element선택, 그리고 1개 삭제
    success = true
  } else {
    errorMsg = "Fail"
  }
  fs.writeFileSync("data/list.json", JSON.stringify(data))
  // 저장
  res.json({ success, errorMsg })
  // 성공여부 api를 통해 확인

  // index 0값을 삭제하면 뒤에 있는 index 1값을 0으로 바꿈으로써 순서 재정렬하는 방법 필요
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})

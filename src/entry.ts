import express from "express"
import cors from "cors"
import controllers from "./controllers"
import apiConfigs from "./configs/api"

import { useMysql } from "./middleware/useMysql"
import { errorHandler } from "./middleware/errorHandler"

const app = express()
const PORT = 3714
// 숫자값, 문자열 등 절대 변하지 않을 값을 참조할 때 대문자로 상수 변수화하는 것이 관례

app.use(express.static("public")) // public이란 폴더에서 정적인 파일을 서비스한다.
app.use(express.urlencoded({ extended: true })) // form 데이터 받아들임, body-parser 포함
app.use(express.json())
app.use(cors())

app.use(useMysql)

// Layered Architecture_Presentation Layer(Controller)
// End-point 정의, Request 받기
controllers
  .registerAllApis(app, apiConfigs) // apiConfigs는 설정값이며 api.ts를 import
  .then(() => {
    // registerAllApis는 비동기 함수니까 then, catch로 에러처리 / 반환해주는 값 없음, 에러 발생시 에러 메시지 보내고, process.exit를 통해 비정상적인 종료 표시, 서버실행 x
    app.use(errorHandler)

    app.listen(PORT, () => {
      // 서버가 만들어지는 과정, 굉장히 간단함.
      console.log(`Example app listening at http://localhost:${PORT}`)
    })
  })
  .catch((e) => {
    console.error(e)
    process.exit(-1)
  })

// controller 계층(함수)
// 모든 API들을 설정값만 갖고 와서 전부 등록이 가능한 함수 => Configs / api.ts(설정값) -> 전부 등록이 가능한 함수를 만들어야 함 -> controllers/index.ts
// Async wrapper => (req, res, next): Async모듈화
// 변수, 응답 (req, res) 객체 전부 갖고 있을 필요 없다. 대신 실질적으로 필요한 것이 있다. (params, mysql) => return

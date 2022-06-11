import mysql, { Connection } from "mysql2/promise"
import mysqlConfig from "../configs/mysql"
// .env값 모듈화
const { ID, PASSWORD, HOST, DB_NAME } = mysqlConfig
// 구조분해할당을 이용하여 리팩토링

// 구조분해할당으로 Connection을 불러옴
// 이미 지정되어 있는 interface도 불러올 수 있다.
// Connection 같은 경우 connectio n의 interface로 규정
const DB_URL = `mysql://${ID}:${PASSWORD}@${HOST}/${DB_NAME}?ssl={"rejectUnauthorized":true}`
// 정보유출막기 위해 환경변수 설정할 것, .env에 저장!

interface customConnection extends Connection {
  run?: Function
}

export interface connectionWithRunFunction extends Connection {
  // 타입을 지정하기 위해 extends 사용
  run: Function
}

const connect = async () => {
  const connection: customConnection = await mysql.createConnection(DB_URL)
  const run = async (sql: string, params: any[] = []) => {
    const [rows, field] = await connection.execute(sql, params)
    return rows
  }
  connection.run = run
  return connection as connectionWithRunFunction // typescript에서 해당 타입으로 리턴하겠다는 의미
}

export default {
  connect,
}

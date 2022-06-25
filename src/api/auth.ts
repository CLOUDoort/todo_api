import { connectionWithRunFunction as connection } from "../modules/mysql"
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"

// 로그인 (토큰 발급) POST /auth

const postAuth = async (params: { id: string; password: string }, mysql: connection) => {
  const { id, password } = params

  const selectHashedPassword = await mysql.run("SELECT password FROM users WHERE id = ?;", [id])
  // 배열로 리턴되기 때문에 그대로 아래에서 사용하면 에러 발생
  const isEqual = await bcrypt.compare(password, selectHashedPassword[0].password)
  // console.log(isEqual) // true, false 리턴

  if (!isEqual) {
    throw new Error("E2000")
  }

  const payload = { id }
  const secret = "web-study"
  const token = JWT.sign(payload, secret) // payload의 id값은 우리가 누구인지 구분짓기 위한 부분, id 값을 알아도 뒤의 secret값을 모르면 token을 알 수 없다.

  return {
    status: 201,
    data: {
      token, // 권한검사로 jsonwebToken 사용할 예정
    },
  }
}

export default {
  postAuth,
}

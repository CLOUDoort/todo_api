// service layered(비즈니스 로직)
// controllers/resisterAllApis의 apiModule(handler), 라우터기능

import { connectionWithRunFunction as connection } from "../modules/mysql"
import bcrypt from "bcrypt"

// request => params, mysql
// response => return => status(http 상태 코드), bodydata

// controllers의 resisterAllApis에서 res, req 처리
// req, res 대신 실질적으로 필요한 params와 mysql을 인자로 받고, return으로 응답해준다.
const getUsers = async (params: any, mysql: connection) => {
  console.log("getUsers Success")
  return {
    // res 대신 return으로 응답
    status: 200,
    data: {
      users: ["data"],
    },
  }
}

// POST /users: users에 한 개체를 추가
// id, password, email, age, name
const postUsers = async (
  params: {
    id: string
    password: string
    email: string
    age: number
    name: string
  },
  mysql: connection
) => {
  const { id, password, email, age, name } = params

  const salt = await bcrypt.genSalt(10) // 소금생성
  const hashedPassword = await bcrypt.hash(password, salt)

  await mysql.run("INSERT INTO users (id, password, email, age, name) VALUES (?, ?, ?, ?, ?);", [id, hashedPassword, email, age, name])

  return {
    status: 201, // 생성해줬기 때문에 200이 아닌 201
    data: "success",
  }
}

// 익명 내보내기
export default {
  getUsers,
  postUsers,
}

// 1. 모바일 인증: NaverCloud
// 2. 이메일 인증: Mailgun, AWS Route53(도메인 구입), 기타 부연 설정,
// 구현되어 있는 서비스를 사용

// 회원들: users
// 1. 회원가입
//    - 회원 등록 POST /users
//    - 이메일 인증 코드 발송 = 인증코드 생성 => POST/verify-codes
//    - 이메일 인증 코드 검증 = 인증코드 읽기 => GET/verify-codes/:code
//
// 2. 로그인 (토큰 발급) POST /auth
//    - 로그인

// 권한 검사 => token 사용

// 암호화 string => 암호화된 문자열 => string (양방향)
// 해시화 string => 일정한 길이의 치환된 문자열 (단방향)

// 해쉬화 사용

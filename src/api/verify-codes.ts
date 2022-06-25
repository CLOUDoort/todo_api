import { connectionWithRunFunction as connection } from "../modules/mysql"
import mailgun from "mailgun-js"
import mailgunConfigs from "../configs/mailgun"

//    - 이메일 인증 코드 검증 = 인증코드 읽기 => GET/verify-codes/:code
const verifyEmailCode = async (params: any, mysql: connection) => {
  return {
    // res 대신 return으로 응답
    status: 200,
    data: {
      users: ["data"],
    },
  }
}

//    - 이메일 인증 코드 발송 = 인증코드 생성 => POST/verify-codes
const sendEmailCode = async (
  params: {
    email: string
  },
  mysql: connection
) => {
  const { email } = params
  const { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM } = mailgunConfigs

  const mailgunClient = new mailgun({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN })
  // 생성자 함수로 사용

  const sendConfig = {
    from: MAILGUN_FROM, // 도용 가능성 있으니 .env파일에 저장해둔다.
    to: email,
    subject: "인증 코드 발송 메일입니다.",
    text: "인증코드 : 123456",
  }

  // promise 사용가능
  await mailgunClient.messages().send(sendConfig)

  return {
    status: 201, // 생성해줬기 때문에 200이 아닌 201
    data: {},
  }
}

// 익명 내보내기
export default {
  verifyEmailCode,
  sendEmailCode,
}

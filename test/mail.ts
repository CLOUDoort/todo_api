const mailgun = require("mailgun-js")
const DOMAIN = "mail.focusnow.click"
const API_KEY = "5905da2d87b5454af36e6ba0e6a2e897-50f43e91-776ac4e6"
const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN })
const data = {
  from: "ppu1234@mail.focusnow.click",
  to: "ppu1234@naver.com",
  subject: "안녕하세요~",
  text: "테스트 메일입니다.",
}
mg.messages().send(data, function (error: any, body: any) {
  console.log(body)
})

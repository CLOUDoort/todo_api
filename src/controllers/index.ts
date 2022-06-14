// Layered Architecture_Presentation Layer(Controller)
// End-point 정의, Request 받기

import { Request, Response, NextFunction, Express } from "express"
import { apiConfigType, apiConfigsType } from "../configs/api"
import path from "path"
import { authorizer } from "../middleware/authorizer"
import { connectionWithRunFunction } from "../modules/mysql"

interface RequestWithConnection extends Request {
  mysqlConnection: connectionWithRunFunction
}

const registerAllApis = async (app: Express, configs: apiConfigsType) => {
  //   app.get("url", (req, res, next) => {}) 이와 같은 형태로 구현되어야 한다.
  for (const apiName in configs) {
    // object에서 key값만 불러와 반복문을 돌리는 문법 => for..in
    // apiName은 api.ts의 getUsers, postUsers... 라우터의 설정값
    const apiConfig: apiConfigType = configs[apiName]
    const { path: urlPath, method, handlerPath, handlerName, authorizer: isRequireAuthorizer } = apiConfig
    // handlerName을 통해 handlerPath를 불러옴

    // handlerPath = "./src/api/users.ts" => 상대경로
    const apiModulePath = path.join(__dirname, "../", "../", handlerPath) // users.ts의 절대경로(모듈)
    const { default: apiModule } = await import(apiModulePath) // users.ts 불러옴

    const handlerFunction: (params: any, mysql: any) => Promise<any> = apiModule[handlerName]
    // async/await을 사용하니까 promise로 반환
    // handlerName을 통해 특정 함수를 불러옴(getUsers, postUsers...)
    // handlerFuncion = users.ts의 특정 함수 로직

    // 여기서 req, res, next 처리하고 apiModule(api.ts)에서는 params와 mysql만 처리하도록 설계
    const APIHandler = (request: Request, response: Response, next: NextFunction) => {
      const req = request as RequestWithConnection
      const res = response
      const params = req.body
      const connection = req.mysqlConnection

      // params 자리에 params값을, mysql자리에 connection을 넣어준다.
      // app[method]에 async를 사용하면 에러처리가 작동하지 않기 때문에 promise를 반환하는 handlerFunction을 내부에서 호출한 뒤
      // then, catch를 통해 에러처리를 한다.
      handlerFunction(params, connection)
        .then((returnObj: { status: number; data: { [key: string]: any } }) => {
          const { status, data } = returnObj

          res.status(status)
          res.json(data)
          // res.json({
          //   success: true,
          //   result: result,
          // })
        })
        .catch((e) => next(e))
    }
    isRequireAuthorizer ? app[method](urlPath, authorizer, APIHandler) : app[method](urlPath, APIHandler)

    // 삼항연산자 사용
    // app.use(middleware) / 모든 경우
    // app.method('url', middleware, (req, res) => {}) / 특정 경우
  }
}

export default {
  registerAllApis,
}

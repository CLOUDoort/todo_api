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
  //   app.get("url", (req, res, next) => {})
  for (const apiName in configs) {
    // object에서 key값만 불러와 반복문을 돌리는 문법 => for..in
    const apiConfig: apiConfigType = configs[apiName]
    const {
      path: urlPath,
      method,
      handlerPath,
      handlerName,
      authorizer: isRequireAuthorizer,
    } = apiConfig

    // __dirname = /Users/cloudoort/Desktop/projects/todo_api/src/controllers => 절대경로
    // handlerPath = "./src/api/users_module.ts" => 상대경로
    const apiModulePath = path.join(__dirname, "../", "../", handlerPath) // 절대경로로 설정
    const { default: apiModule } = await import(apiModulePath)

    // path.join은 운영체제 별로 파일import default from '../modules/mysql';
    // 을 표현한는 방식이 다르기 때문에, 경import { authorizer } from '../middleware/authorizer';
    // 로를 합치는데 있어서 아무 문제 없이 경로를 합쳐주는 함수
    // 동적 가져오기 / 시간이 어느정도 들어가는 작업이라서 await 사용/ directory name
    // app[method](path, handlerPath)
    const handlerFunction: (params: any, mysql: any) => Promise<any> =
      apiModule[handlerName]

    const APIHandler = (
      request: Request,
      response: Response,
      next: NextFunction
    ) => {
      const req = request as RequestWithConnection
      const res = response
      const params = req.body
      const connection = req.mysqlConnection

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
    isRequireAuthorizer
      ? app[method](urlPath, authorizer, APIHandler)
      : app[method](urlPath, APIHandler)

    // app.use(middleware) / 모든 경우
    // app.method('url', middleware, (req, res) => {}) / 특정 경우
  }
}

export default {
  registerAllApis,
}

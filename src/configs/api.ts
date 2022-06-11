// Controller의 Configs(설정값)

export interface apiConfigType {
  path: string
  method: "get" | "post" | "put" | "delete"
  handlerPath: string
  handlerName: string
}

export type apiConfigsType = { [key: string]: apiConfigType }

const apiConfigs: apiConfigsType = {
  getUsers: {
    path: "/users",
    method: "get",
    handlerPath: "./src/api/users.ts",
    handlerName: "getUsers",
  },
  postUsers: {
    path: "/users",
    method: "post",
    handlerPath: "./src/api/users.ts",
    handlerName: "postUsers",
  },
  postAuth: {
    path: "/auth",
    method: "post",
    handlerPath: "./src/api/auth.ts",
    handlerName: "postAuth",
  },
}

export default apiConfigs

// Controller의 Configs(설정값)

// apiConfigs value 타입지정

// 타입은 재사용되기 때문에 네임드 export해준다.
export interface apiConfigType {
  path: string
  method: "get" | "post" | "put" | "delete"
  // string으로 설정했을 때, 에러 발생 => 실제 들어갈 값으로 설정
  // method는 실제 있는 값으로만 접근하기 때문에 아무런 에러가 발생하지 않는다.
  handlerPath: string
  handlerName: string
  authorizer: boolean
}

// apiConfigs 타입 지정
export type apiConfigsType = { [key: string]: apiConfigType }
// key값과 value값이 정확히 무엇이 들어올 지 모를 때 {[key: string]: any}로 타입을 설정하는데 여기서는 value값이 어떤 값이 들어올 지 확실하기 때문에 value 타입을 따로 만들어주어서 넣어준다.

const apiConfigs: apiConfigsType = {
  getUsers: {
    path: "/users",
    method: "get",
    handlerPath: "./src/api/users.ts",
    handlerName: "getUsers",
    authorizer: true,
  },
  postUsers: {
    path: "/users",
    method: "post",
    handlerPath: "./src/api/users.ts",
    handlerName: "postUsers",
    authorizer: false, // 토큰을 발급받는 로그인 파트이기 때문에 authorizer는 필요없다.
  },
  postAuth: {
    path: "/auth",
    method: "post",
    handlerPath: "./src/api/auth.ts",
    handlerName: "postAuth",
    authorizer: false,
  },
  sendEmailCode: {
    path: "/verify-codes",
    method: "post",
    handlerPath: "./src/api/verify-codes.ts",
    handlerName: "sendEmailCode",
    authorizer: false,
  },
}

export default apiConfigs
// 익명 내보내기

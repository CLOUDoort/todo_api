// typescript는 컴파일 언어, js로 변환하는 과정이 필요(ts-node)를 사용하여 바로 테스트할 수 있게 도와주는 모듈 사용

import { rejects } from "assert"

console.log("hello")

// 선언해주고자 하는 변수에 타입을 지정해줘야 한다.
// number, string, boolean, undefined, null, function, {}, []
let what: any = 3
// 무엇이 들어와도 허용하겠다는 의미/ 필살기 => 무엇이든 가능, 웬만하면 사용하지 말 것

const obj: { age: number; name?: string } = {
  age: 13,
}
// ? 붙이면 있어도 없어도 상관없다.
obj.name = "junseok"

const object: { [index: string]: any } = {}
// => 오브젝트 타입, index는 object의 key를 의미하고 string으로만 받겠다. 그리고 value값은 any로 정의하여 아무 값이나 받을 수 있다
// 하지만 객체 안에 어떤 키 값을 넣어도 전부 string으로 저장하기 때문에 어떤 키 값을 넣어도 상관없다.

const obje: { age: number; [index: string]: any } = {
  // age의 타입이 정말 필요하다면 그냥 위 타입을 추가해주면 된다.
  age: 13,
  name: "junseok",
}

const sumFunc = (num1, num2) => {
  return num1 + num2
}

const sum: (num1: number, num2: number) => number = sumFunc

const asyncSum = async (num1, num2) => {
  return num1 + num2
  // async는 promise를 반환함
}

const retPromise = (): Promise<number> => {
  return new Promise((res, rej) => {
    res(3)
  })
}

const asyncSumExam: (num1: number, num2: number) => Promise<number> = asyncSum // any 대신 들어가야 할 자료형태는?

// async 안 씀
// any 안 씀

// type보다는 interface지향 / 더 공부해봐야 함

type sd = number // 상수형태의 타입지정, 타입은 정적이기 때문에 상수형태가 적절

interface obj2 {
  age: number
  name: string
}

interface obj3 extends obj2 {
  // interface는 상속도 가능
  email: "Dsd"
}

const customNumber2: obj2 = {
  age: 9,
  name: "sdsd",
}

const customNumber: sd = 3

// restful, middleware 개념 공부하기
// get post put delete 등 crud 로 사용하는것이 restful 디자인 규격

// 보다 명시적으로 알기 위해 url작성원칙이 정해져있는 것이 restful 규격
// restful design/api,
// http 에 엄청나게 많은 methods들 존재

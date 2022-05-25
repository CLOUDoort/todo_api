import fs from "fs/promises" // 오래 걸리는 작업

const read = async () => {
  const buffer = await fs.readFile("./public/data.json")
  const stringData = buffer.toString()

  const data = JSON.parse(stringData)
  console.log("data", data)
}

// promise를 사용하는 것이 활용면에서 더 좋다.
// readFileSync는 동기적 처리만 가능하고 promise를 사용하면 이후 then을 사용하는 등 활용도를 더 넓힐 수 있다.

// read()

const write = async () => {
  await fs.writeFile("./public/data.json", '[{ "age": 17}]')
}

// write()

// 네트워크 통신
// 무거운 파일들을 로컬로 직접 작업
// 오래 걸리고 무거운 작업(동기 => 비동기)

const read1 = async () => {
  const nums = [1, 2, 3, 4]
  const results = []
  for (const num of nums) {
    // 동기
    const result = await fs.readFile(`./public/${num}.json`).toString()
  }
}
read1()

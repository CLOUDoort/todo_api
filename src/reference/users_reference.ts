// users 모듈화
import express, { Request, Response, NextFunction } from "express"
const router = express.Router()

interface RequestWithConnection extends Request {
  mysqlConnection: any
}

// users: 집합(컬렉션)
// /users/2/name 예시

// GET /users: users의 모든 정보 읽기 (컬렉션 리스트 읽기)
router.get("/users", async (request: Request, response: Response) => {
  const req = request as RequestWithConnection
  const res = response
  const connection = req.mysqlConnection
  const selectData = await connection.run(`SELECT * FROM users;`)

  res.send(selectData)
})

// GET /users/5: users의 한 개체의 정보 읽기 / path_parameter 추가
router.get("/users/:userIdx", async (request: Request, response: Response) => {
  const req = request as RequestWithConnection
  const res = response
  const { userIdx } = req.params

  const connection = req.mysqlConnection
  const [selectUserResult] = await connection.run(
    // 하나의 정보만을 가져오게 하기 위해 구조분해할당하고 첫 번째 값을 가져오게 한다.
    `SELECT * FROM users WHERE idx = ?;`,
    [userIdx]
  )
  res.send(selectUserResult)
})

// CREATE /users: users에 한 개체를 추가
router.post("/users", async (request: Request, response: Response) => {
  const req = request as RequestWithConnection
  const res = response
  const { id, password, name, age } = req.body

  const connection = req.mysqlConnection
  const postUserData = await connection.run(
    `INSERT INTO users (id, password, name, age) VALUES (?, ?, ?, ?)`,
    [id, password, name, age]
  )
  res.send({
    success: true,
  })
})

// PUT /users: users 컬렉션을 전부 수정하겠다.(RESTful에서는 주로 사용되지 않는다.)
// 새로 덮어 씌운다는 의미
router.put("/users", async (req, res) => {
  // users 테이블의 모든 정보 제거
  // users AutoIncrement 초기화
  // users에 새로운 users 정보를 다수 추가

  res.send({
    success: true,
  })
})

// UPDATE / path_parameter를 통해 일부 수정
router.put(
  "/users/:userIdx",
  async (request: Request, response: Response, next: NextFunction) => {
    const req = request as RequestWithConnection
    const res = response
    const { userIdx } = req.params
    const { id, password, name, age } = req.body

    const connection = req.mysqlConnection
    try {
      await connection.beginTransaction()
      await connection.run(
        `UPDATE users SET id = ?, password = ? WHERE idx = ?;`,
        [id, password, userIdx]
      )
      // throw new Error("트랜잭션 중 에러")
      await connection.run(
        `UPDATE users SET name = ?, age = ? WHERE idx = ?;`,
        [name, age, userIdx]
      )
      await connection.commit()
      res.send({
        success: true,
      })
    } catch (e) {
      await connection.rollback()
      next(e)
    }
  }
)

// DELETE / path_parameter를 통해 일부 삭제
router.delete(
  "/users/:userIdx",
  async (request: Request, response: Response) => {
    const req = request as RequestWithConnection
    const res = response
    const { userIdx } = req.params

    const connection = req.mysqlConnection
    const deleteDB = await connection.run(`DELETE FROM users WHERE idx = ?;`, [
      userIdx,
    ])
    res.send({
      success: true,
    })
  }
)

export default router

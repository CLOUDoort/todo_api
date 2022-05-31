// users, posts 모듈화

import { count } from "console"
import express, { Request, Response } from "express"

const router = express.Router()

interface RequestWithConnection extends Request {
  mysqlConnection: any
}

// 특정 유저가 소유하고 있는 게시글 전부 읽기
router.get(
  "/users/:userIdx/posts",
  async (request: Request, response: Response) => {
    const req = request as RequestWithConnection
    const res = response

    const { userIdx } = req.params

    const connection = req.mysqlConnection
    const selectUsersPostsResult: {
      title: string
      contents: string
      id: string
    }[] = await connection.run(
      `SELECT title, contents, u.id
    FROM posts AS p JOIN users AS u
    ON p.author_idx = u.idx
    WHERE p.author_idx = ?;`,
      [userIdx]
    )

    const responseBodyData = selectUsersPostsResult.map((data) => {
      const { title, contents, id: userId } = data
      return { title, contents, userId }
    })
    res.send(response)
  }
)

// 특정 유저의 게시글 추가
// 이대로 적으면 문제가 하나 생긴다. 특정 유저가 없을 경우, 나중에 가입한 유저가 쓴 적도 없는 글이 유저가 작성한 것처럼 저장된다.
// 즉 주인이 없는 게시글이 생기는 것
router.post(
  "/users/:userIdx/posts",
  async (request: Request, response: Response) => {
    const req = request as RequestWithConnection
    const res = response
    const { title, contents } = req.body
    const { userIdx } = req.params

    const connection = req.mysqlConnection

    // users에서 해당 userIdx가 있는지 없는지 검사, 1이 나오면 user가 있는 거고 0이면 user가 없는 것
    const countUserResult = await connection.run(
      `SELECT COUNT(*) AS count FROM users WHERE idx = ?;`,
      [userIdx]
    )
    if (countUserResult[0].count !== 1) {
      throw new Error("해당되는 유저의 idx가 존재하지 않습니다.")
    }
    await connection.run(
      `INSERT INTO posts (title, contents, author_idx ) VALUES (?, ?, ?);`,
      [title, contents, userIdx]
    )
    res.send({
      success: true,
    })
  }
)

// PUT 특정 유저의 게시글에서 특정 idx의 게시글 수정
router.put(
  "/users/:userIdx/posts/:postIdx",
  async (request: Request, response: Response) => {
    const req = request as RequestWithConnection
    const res = response
    const { userIdx, postIdx } = req.params
    const { title, contents } = req.body

    const connection = req.mysqlConnection

    try {
      // throw new Error("갑작스러운 에러")
      const countUser = await connection.run(
        `SELECT COUNT(*) AS count FROM users WHERE idx = ?;`,
        [userIdx]
      )
      if (countUser[0].count !== 1) {
        throw new Error("해당 유저는 존재하지 않습니다.")
      }
      const countPost = await connection.run(
        `SELECT COUNT(*) AS count FROM posts WHERE idx = ?;`,
        [postIdx]
      )
      if (countPost[0].count !== 1) {
        throw new Error("해당 글은 존재하지 않습니다.")
      }
      await connection.run(
        `UPDATE posts SET title = ?, contents = ? WHERE idx = ?;`,
        [title, contents, postIdx]
      )
      res.send({
        success: true,
      })
    } catch (e) {
      res.send({
        success: false,
        errorMessage: `${e}`,
      })
    }
  }
)

// DELETE 특정 유저의 게시글에서 특정 idx의 게시글 삭제
router.delete(
  "/users/:userIdx/posts/:postIdx",
  async (request: Request, response: Response) => {
    const req = request as RequestWithConnection
    const res = response
    const { userIdx, postIdx } = req.params

    const connection = req.mysqlConnection

    try {
      const countUser = await connection.run(
        `SELECT COUNT(*) AS count FROM users WHERE idx = ?;`,
        [userIdx]
      )
      if (countUser[0].count !== 1) {
        throw new Error("해당 유저는 존재하지 않습니다.")
      }
      const countPost = await connection.run(
        `SELECT COUNT(*) AS count FROM posts WHERE idx = ?;`,
        [postIdx]
      )
      if (countPost[0].count !== 1) {
        throw new Error("해당 글은 존재하지 않습니다.")
      }
      await connection.run(`DELETE FROM posts WHERE idx = ?;`, [postIdx])
      res.send({
        success: true,
      })
    } catch (e) {
      res.send({
        success: false,
        errorMessage: `${e}`,
      })
    }
  }
)

export default router

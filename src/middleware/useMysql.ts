import { Request, Response, NextFunction } from 'express'
import mysql from '../modules/mysql'

interface RequestWithConnection extends Request {
    mysqlConnection?: any
}

export const useMysql = async (req: RequestWithConnection, res: Response, next: NextFunction) => {
    mysql
        .connect()
        .then((connection) => {
            req.mysqlConnection = connection
            next()
        })
        .catch((e: Error) => {
            next(e)
        })
}

import { NextFunction, Request, Response, Router } from 'express'
import { verifyToken } from 'src/libs'

export default abstract class BaseController {
  public router: Router

  constructor() {
    this.router = Router()
  }

  abstract configureRoutes(): void

  protected _showRoutes() {
    let routePaths = []
    this.router.stack.forEach((stack: any) => {
      routePaths.push({
        controller: this.constructor.name,
        path: stack.route?.path,
        method: (stack.route?.stack[0]?.method).toUpperCase()
      })
    })
    console.table(routePaths, ['controller', 'method', 'path'])
  }

  protected _auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body?.token || req.headers['authorization'] || req.headers['x-access-token']

    if (!token) {
      res.status(401).json('Unauthorized!')
      return
    }

    try {
      const decoded = verifyToken(token)
      // console.log({ decoded })
      req.user = {
        userId: decoded.aud
      }
    } catch (err) {
      res.status(403).json('Invalid Token')
      return
    }
    next()
  }

  // protected _checkRoles = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const userId = req.user?.userId
  //     const communityId = req.params?.communityId || req.body?.community_id || req.query?.communityId

  //     if (!communityId) {
  //       res.status(400).json({ message: 'content missing' })
  //       return
  //     }

  //     const member = await memberRepo.checkIfUserIsMember(communityId, userId)

  //     if (!member || !member.role) {
  //       res.status(403).json({ message: 'you do not have permission to access this route' })
  //       return
  //     }

  //     req.user.role = member.role
  //   } catch (error) {
  //     next(error)
  //     return
  //   }
  //   next()
  // }

  // protected _checkRolesWithPostId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   const userId = req.user.userId
  //   const postId = req.params?.postId || req.body?.post_id

  //   const errors: ErrorType = {}

  //   if (!postId) errors.message = 'content missing'

  //   if (Object.keys(errors).length) {
  //     res.status(400).json(errors)
  //     return
  //   }

  //   try {
  //     const memberRole = await postRepo.getMemberRoleByPostId(postId, userId)

  //     req.user.role = memberRole.community.members.length ? memberRole.community.members[0].role : null
  //   } catch (error) {
  //     next(error)
  //   }
  //   next()
  // }
}

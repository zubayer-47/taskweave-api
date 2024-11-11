import BaseController from './base.controller'

class AuthorityController extends BaseController {
  constructor() {
    super()
    this.configureRoutes()
  }

  configureRoutes() {}
}

export default new AuthorityController()

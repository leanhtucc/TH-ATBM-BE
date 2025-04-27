import authRouter from './auth.router.js'
import passwordRouter from './password.router.js'

const routeProject = (app) => {
  app.use('/auth', authRouter)
  app.use('/passwords', passwordRouter)
}

export default routeProject

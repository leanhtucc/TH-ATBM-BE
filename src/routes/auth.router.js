import express from 'express'
import * as authController from '../app/controllers/auth.controller'
import { requireAuth } from '../app/middleware/auth.middleware'
import validate from '../app/middleware/common/validate'
import { registerSchema, loginSchema, refreshTokenSchema } from '../app/requests/auth.request'
import { asyncHandler } from '../utils/helpers/async.helper'

const router = express.Router()

// Public routes
router.post('/register', validate(registerSchema), asyncHandler(authController.register))
router.post('/login', validate(loginSchema), asyncHandler(authController.login))
router.post('/verify-2fa', asyncHandler(authController.verify2FA))
router.post('/refresh', validate(refreshTokenSchema), asyncHandler(authController.refresh))

// Protected routes
router.put('/2fa-settings', requireAuth, asyncHandler(authController.update2FASettings))

export default router

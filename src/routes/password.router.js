import express from 'express'
import * as passwordController from '../app/controllers/password.controller'
import { requireAuth } from '../app/middleware/auth.middleware'
import validate from '../app/middleware/common/validate'
import { addPasswordSchema, updatePasswordSchema, deletePasswordSchema } from '../app/requests/password.request'
import { asyncHandler } from '../utils/helpers/async.helper'

const router = express.Router()

// All routes are protected
router.use(requireAuth)

// Get all passwords
router.get('/', asyncHandler(passwordController.getAllPasswords))

// Get a single password
router.get('/:id', asyncHandler(passwordController.getPasswordById))

// Create a new password
router.post('/', validate(addPasswordSchema), asyncHandler(passwordController.savePassword))

// Update a password (với id trong body)
router.put('/', validate(updatePasswordSchema), asyncHandler(passwordController.updatePassword))
// Update a password (với id trong URL)
router.put('/:id', validate(updatePasswordSchema), asyncHandler(passwordController.updatePassword))

// Delete a password (với id trong URL)
router.delete('/:id', asyncHandler(passwordController.deletePassword))
// Delete a password (với id trong body)
router.delete('/', validate(deletePasswordSchema), asyncHandler(passwordController.deletePassword))

export default router

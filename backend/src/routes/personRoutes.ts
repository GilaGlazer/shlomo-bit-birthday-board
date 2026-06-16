import { Router } from 'express';
import * as personController from '../controllers/personController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate, validateQuery, validateParams } from '../middlewares/validate';
import {
  createPersonSchema,
  updatePersonSchema,
  paginationSchema,
  idParamSchema,
} from '../schemas/personSchemas';

const router = Router();

// All people routes require authentication
router.use(authMiddleware);

router.get('/today', personController.todayBirthdays);
router.get('/', validateQuery(paginationSchema), personController.list);
router.post('/', validate(createPersonSchema), personController.create);
router.patch('/:id', validateParams(idParamSchema), validate(updatePersonSchema), personController.update);
router.delete('/:id', validateParams(idParamSchema), personController.remove);

export default router;

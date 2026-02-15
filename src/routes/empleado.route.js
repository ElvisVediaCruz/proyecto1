import { Router }  from "express";
import { getEmpleados, createEmpleado } from "../controllers/empleado.controller.js";
import middleware from '../middleware/session.js';

const router = Router();

router.get('/getEmpleado', middleware, getEmpleados);
router.post('/createEmpleado', middleware, createEmpleado);

export default router;
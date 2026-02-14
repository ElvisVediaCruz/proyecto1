import { Router }  from "express";
import { getEmpleados, createEmpleado } from "../controllers/empleado.controller.js";

const router = Router();

router.get('/getEmpleado', getEmpleados);
router.post('/createEmpleado', createEmpleado);

export default router;
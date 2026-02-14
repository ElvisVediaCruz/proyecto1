import { Router }  from "express";
import { loginEmpleado, logoutEmpleado } from "../controllers/login.controller.js";

const router = Router();

router.post('/login', loginEmpleado);
router.post('/logout', logoutEmpleado);

export default router;
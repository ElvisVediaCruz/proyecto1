import {Router} from "express";
import {ventaController, getData} from "../controllers/venta.controller.js";
import session from '../middleware/session.js';

const router = Router();

router.post('/venta', session, ventaController);
router.get('/data-dashboard', session, getData);

export default router;
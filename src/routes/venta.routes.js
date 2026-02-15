import {Router} from "express";
import {ventaController, getData} from "../controllers/venta.controller.js";
import middleware from '../middleware/session.js';

const router = Router();

router.post('/venta', middleware, ventaController);
router.get('/data-dashboard', middleware, getData);

export default router;
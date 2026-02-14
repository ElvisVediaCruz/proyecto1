import {Router} from "express";
import {ventaController, getData} from "../controllers/venta.controller.js";

const router = Router();

router.post('/venta', ventaController);
router.get('/data-dashboard', getData);

export default router;
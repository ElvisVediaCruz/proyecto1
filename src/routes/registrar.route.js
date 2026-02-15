import { Router }  from "express";
import {lectorBarcode} from "../controllers/registrar.controller.js";
import middleware from '../middleware/session.js';

const router = Router();

router.get('/lector', middleware, lectorBarcode);

export default router;
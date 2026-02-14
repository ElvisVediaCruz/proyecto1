import { Router }  from "express";
import {lectorBarcode} from "../controllers/registrar.controller.js";

const router = Router();

router.get('/lector', lectorBarcode);

export default router;
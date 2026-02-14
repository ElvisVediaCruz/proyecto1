import { Router } from "express";
import {generatePDF} from "../../controllers/pdf/pdf.controller.js";

const router = Router();

router.get('/generar-pdf', generatePDF);

export default router;
import { Router }  from "express";
import {getProductos, createProduct, getProductosAll, updateProduct, countProducts} from "../controllers/producto.controller.js";

const router = Router();

router.get('/getProduct/:id', getProductos);
router.get('/getProductsAll/:page', getProductosAll);
router.get('/countProduct', countProducts);

router.post('/createProduct', createProduct);

router.put("/updateProduct", updateProduct);

export default router;
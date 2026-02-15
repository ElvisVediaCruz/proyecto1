import { Router }  from "express";
import {getProductos, createProduct, getProductosAll, updateProduct, countProducts} from "../controllers/producto.controller.js";
import middleware from '../middleware/session.js';
const router = Router();

router.get('/getProduct/:id', middleware, getProductos);
router.get('/getProductsAll/:page', middleware, getProductosAll);
router.get('/countProduct', middleware, countProducts);

router.post('/createProduct', middleware, createProduct);

router.put("/updateProduct", middleware, updateProduct);

export default router;
import pool from '../config/database.js';
import validators from '../utils/validators.js';


export const getProductos = async (id) => {
    const idObtenido = id;
    try {
        const [rows] = await pool.execute('SELECT nombre, precio FROM producto WHERE id = ?', [idObtenido]);
        res.status(200).json({
            ok: true,
            producto: rows[0]
        })
    } catch (error) {
        next(error);
    }
}
export const countProducts = async (req, res, next) => {
    const query = "SELECT COUNT(nombre) as total FROM producto";
    //agregar stock a productos en la BD
    //const query = "SELECT COUNT(nombre) as total COUNT(STOCK) as stock FROM producto";
    let result = null;
    try {
        [result] = await pool.execute(query);
        res.status(200).json({
            ok: true,
            count: result[0]
        });
        
    } catch (error) {
        next(error);
    }
}
export const getProductosAll = async (req, res, next) => {
    let ofset = Number(req.params.page) || 0;
    let limit = 10;
    let off = ofset * limit;
    try {
        const query = `SELECT id, nombre, precio, id_categoria FROM producto LIMIT ${limit} OFFSET ${ofset}`;
        let result = null;
        [result] = await pool.execute(query);
        res.status(200).json({
            ok:true,
            products: result
        })
    } catch (error) {
        next(error);
    }
}
//api para crear productos
export const createProduct = async (req, res, next) => {
    const data = req.body;
    const regexNumeros = /^\+?(\d.*){7,15}$/;
    const query = 'CALL create_product(?, ?, ?, @resultado)';
    if (!validators.validatorProducto(data, regexNumeros)){
        return next(new Error("Datos incorrectos"));
    }
    let result = null;
    try{12
        if(validar(data.precio) && validar(data.id_categoria)){
            result = await pool.execute(query, 
            [
                data.nombre,
                data.precio,
                data.id_categoria
            ]);
            const resultado = await pool.execute('SELECT @resultado as resultado');
            res.status(201).json({
                ok: true,
                message: resultado[0][0].resultado
            })
        }else{
            return next(new Error("Precio e id_categoria deben ser números"));
        }
    }catch(error){
        next(error);
    }
}
export const updateProduct = async (req, res, next) => {
    const data = req.body;
    //pensar como ariamos para que solo actualize los que se modificaron
    //modificar consulta SQL
    const query = "UPDATE producto set nombre = ?, precio = ? WHERE id = ? ";
    try{
        const response = await pool.execute(query, 
            [
                data.nombre, 
                data.precio, 
                1
            ]);
        console.log(response);
        res.status(200).json({
            ok: true
        })
    }catch(error){
        next(error);
    }
}



function validar(valor){
    return !isNaN(valor) && typeof valor === 'number';
}
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
        res.status(400).json({
            ok: false,
            error: error.message
        })
    }
}
export const countProducts = async (req, res) => {
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
        res.status(400).json({
            ok:false,
            error: error.message
        })
    }
}
export const getProductosAll = async (req, res) => {
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
        res.status(400).json({
            ok:false,
            error: error.message
        })
    }
}
//api para crear productos
export const createProduct = async (req, res) => {
    const data = req.body;
    const regexNumeros = /^\+?(\d.*){7,15}$/;
    const query = 'CALL create_product(?, ?, ?, @resultado)';
    if (!validators.validatorProducto(data, regexNumeros)){
        return res.status(400).json({
            ok: false,            
            message: "datos incorrectos"
        });
    }
    let result = null;
    try{12
        if(validar(precio) && validar(id_categoria)){
            result = await pool.execute(query, 
            [
                data.nombre,
                precio,
                id_categoria
            ]);
            const resultado = await pool.execute('SELECT @resultado as resultado');
            console.log([[resultado]]);
            res.status(201).json({
                ok: true,
                message: resultado[0][0].resultado
            })
        }else{
            throw new Error('El precio del producto no es el correcto')
        }
    }catch(error){
        res.status(400).json({
            ok:false,
            message: error.message
        })
    }
}
export const updateProduct = async (req, res) => {
    const data = req.body;
    //pensar como ariamos para que solo actualize los que se modificaron
    //modificar consulta SQL
    console.log(data);
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
        res.status(400).json({
            ok: false,
            message: error.message
        })
    }
}



function validar(valor){
    return !isNaN(valor) && typeof valor === 'number';
}
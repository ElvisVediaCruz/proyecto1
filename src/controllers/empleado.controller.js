import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import validators from '../utils/validators.js';

export const createEmpleado = async (req, res, next) => {
   const data = req.body;
   const regexTexto = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
   const regexNumeros = /^\+?(\d.*){7,15}$/;
   const query = `INSERT INTO 
                empleado (ci, nombre, apellidos, direccion, telefono, cargo, usuario, pasword)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
    if (!validators.validateEmpleado(data, regexNumeros, regexTexto)){
        return next(new Error("Datos incorrectos, revise los datos ingresados"));
    }
    //implementar correo electronico en la tabla empleado
    //nota importante: transformar los datos en mayuscula o minuscula para evitar errores de validacion
    try {
        const passwordHash = await bcrypt.hash(data.password, 10);
        let ci = parseInt(data.ci);
        const result = await pool.execute(query,
            [
                ci, 
                data.nombre, 
                data.apellidos, 
                data.direccion, 
                data.telefono, 
                data.cargo, 
                data.usuario, 
                passwordHash
            ]);
            res.status(200).json({
                ok: true,
                usuario:"Se agrego correctamente el usuario"
            })
    } catch (error) {
        nex(error);
    }
}
export const getEmpleados = async (req, res, next) => {
    const query = "SELECT ci, nombre, apellidos, direccion, telefono, cargo, usuario FROM empleado";
    let result = null;
    try {
        result = await pool.execute(query);
        if(!result){
            return next(new Error("Error al obtener los empleados"));
        }
        const [empleados] = result;
        res.status(200).json({
            ok: true,
            empleados: empleados
        })
    } catch (error) {
        next(error);
    }
}
function validar(correo, telefono, nombre, apellidos, cargo){
    return telefono && nombre && apellidos && cargo;
}
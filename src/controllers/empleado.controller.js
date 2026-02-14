import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const createEmpleado = async (req, res) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   const phoneRegexBO = /^(?:\+591\s?)?[67]\d{7}$/;
   const textRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/;
   const textRegexCargo = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s-]{2,50}$/;
   const data = req.body;
   const query = `INSERT INTO 
                empleado (ci, nombre, apellidos, direccion, telefono, cargo, usuario, pasword)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
    /*
    if(!validar(emailRegex.test(data.correo), phoneRegexBO.test(data.telefono), textRegex.test(data.nombre), textRegex.test(data.apellidos), textRegexCargo.test(data.cargo))){
        return res.status(400).json({
            ok: false,
            message: "datos incorrectos"
        });
    }
    */
    //implementar correo electronico en la tabla empleado

    try {
        //cambiar el valor de pasword en la bd de empleados para que acepte
        //mas de 20 caracteres
        //
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
        console.log(error)
        res.status(400).json({
            ok: false,
            error: error.message
        })
    }
}
export const getEmpleados = async (req, res) => {
    const query = "SELECT ci, nombre, apellidos, direccion, telefono, cargo, usuario FROM empleado";
    let result = null;
    try {
        result = await pool.execute(query);
        if(!result){
            return res.status(400).json({
                ok: false
            });
        }
        const [empleados] = result;
        res.status(200).json({
            ok: true,
            empleados: empleados
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            error: error.message
        })
    }
}
function validar(correo, telefono, nombre, apellidos, cargo){
    return telefono && nombre && apellidos && cargo;
}
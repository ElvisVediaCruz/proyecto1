import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import validators from '../utils/validators.js'


export const loginEmpleado = async (req, res) => {
    const data = req.body;
    //console.log(data)
    if(!validators.validateLogin(data.usuario, data.password)) return res.status(400).json({ok: false, message: "campos obligatorios"});

    const query = "select nombre, cargo, usuario, pasword from empleado where usuario = ?";
    try {
        const [rows] = await pool.execute(query, [data.usuario]);
        if(rows.length === 0){
            return res.status(400).json({
                ok: false,
                message: "Usuario no encontrado"
            });
        }
        const empleado = rows[0];
        const passwordMatch = await bcrypt.compare(data.password, empleado.pasword);
        if(!passwordMatch){
                return res.status(400).json({
                    ok: false,
                    message: "Contraseña incorrecta"
                });
        }
        req.session.usuario = {
            nombre: empleado.nombre,
            cargo: empleado.cargo,
            usuario: empleado.usuario
        }
        req.session.loginTime = Date.now();
        res.status(200).json({
            ok: true,
            message: "Login exitoso",
            usuario: req.session.usuario
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            error: error.message
        })
    }
}

export const logoutEmpleado = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "Error al cerrar sesión"
            });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({
            ok: true,
            message: "Sesión cerrada exitosamente"
        });
    });
}
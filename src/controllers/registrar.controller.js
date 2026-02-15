// src/controllers/producto.controller.js
export const lectorBarcode = async (req, res, next) => {
    const { codigo } = req.params;
    try {
        const [rows] = await pool.query('SELECT id FROM productos WHERE id = ?', [codigo]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            return next(new Error("Producto no encontrado"));
        }
    } catch (error) {
        next(error);
    }
};
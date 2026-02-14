// src/controllers/producto.controller.js
export const lectorBarcode = async (req, res) => {
    const { codigo } = req.params;
    try {
        const [rows] = await pool.query('SELECT id FROM productos WHERE id = ?', [codigo]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
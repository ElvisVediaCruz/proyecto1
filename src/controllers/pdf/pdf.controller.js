import pdfDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
export const generatePDF = (datos, res) => {
    const productos = datos;
    const total = 0;

    const filePath = path.join(
        process.cwd(),
        "src",
        "files",
        `ticket_${Date.now()}.pdf`
    )

    const doc = new pdfDocument ({
        size: 'A7',
        margin: 10
    })
    console.log(filePath)
    doc.pipe(fs.createWriteStream(filePath));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="ticket.pdf"');
    doc.pipe(res);  
    doc.fontSize(12).text('Tienda de Barrio', {align: 'center'});
    doc.moveDown();
    console.log('');
    productos.producto.forEach( product => {

        doc.fontSize(10).text(`Producto: ${product.nombre}`);
        doc.fontSize(10).text(`Precio: $${product.precio.toFixed(2)}`);
        doc.fontSize(10).text(`Cantidad: ${product.cantidad}`);
        doc.fontSize(10).text(`Subtotal: $${product.subTotal.toFixed(2)}`);
        doc.moveDown();
        console.log('producto agregado al pdf: ', product);
    });
    doc.fontSize(12).text(`Total: $${productos.total.toFixed(2)}`, {align: 'right'});
    doc.end();
}
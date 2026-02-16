import pdfDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
export const generatePDF = (datos) => {
    
    return new Promise((resolve, reject) => {
        const filePath = path.join(
            process.cwd(),
            "src",
            "files",
            `ticket_${Date.now()}.pdf`
        );

        const doc = new pdfDocument({
            size: 'A7',
            margin: 10
        });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);
        datos.producto.forEach( product => {

            doc.fontSize(10).text(`Producto: ${product.nombre}`);
            doc.fontSize(10).text(`Precio: $${product.precio.toFixed(2)}`);
            doc.fontSize(10).text(`Cantidad: ${product.cantidad}`);
            doc.fontSize(10).text(`Subtotal: $${product.subTotal.toFixed(2)}`);
            doc.moveDown();
            console.log('producto agregado al pdf: ', product);
        });

        doc.end();

        stream.on("finish", () => resolve(filePath));
        stream.on("error", reject);
    });
    
}
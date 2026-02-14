//const { get } = require('../app.js');
//import { slice } from 'pdfkit/js/data.js';
import pool from '../config/database.js';
import { generatePDF } from '../controllers/pdf/pdf.controller.js';
import { getProductos } from './producto.controller.js';

const cache = new Map();

export const ventaController = async (req, res) => {

    //productos solo recibira los datos del id y la cantidad
    let productosJSONformato = null;
    let connection = null;
    try {
        const {productos, fecha} = req.body;
        connection = await pool.getConnection();
        await connection.beginTransaction();
        productosJSONformato = await getJsonProductos(productos);
        const query_a = 'INSERT INTO venta (total, fecha) VALUES (?, ?)';
        const query_b = 'INSERT INTO transaccion (cantidad, id_venta, id_producto) VALUES (?, ?, ?)';
        const [ventaResult] = await pool.execute(query_a, [productosJSONformato.total, fecha]);
        const ventaId = ventaResult.insertId;

        for (const productostransaccion of productosJSONformato.producto){
            await pool.execute(query_b, [productostransaccion.cantidad, ventaId, productostransaccion.id]);
        }
         //hacer la llamada al generarPDF
        //await generatePDF(productosJSONformato, res);
        console.log('Venta procesada con exito');
        await connection.commit();
       res.status(201).json({message: 'venta realizada con exito', ventaId: ventaId, total: productosJSONformato.total});
        
        //res.status(201).json({message: 'venta realizada con enxito'});
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Error al procesar la venta', error: error.message });
    } finally{
        if (connection) connection.release();
    }
}
async function getJsonProductos(productos) {
    let totalAcumulado = 0;
    let productosJSON = {
        producto: [],
        total: 0
    };
    for (const product of productos){
        const producDetail = await getProductos(product.id_producto);
        const sub = Math.round(producDetail[0].precio * product.cantidad)/100;
        const productoInfo = {
            id: product.id_producto,
            nombre: producDetail[0].nombre,
            precio: producDetail[0].precio,
            cantidad: product.cantidad,
            subTotal: sub
        }
        productosJSON.producto.push(productoInfo);
        totalAcumulado += productoInfo.subTotal;
    }
    productosJSON.total = Math.round(totalAcumulado * 100) / 100;
    return productosJSON;
}

//funciones para get para mostrar el dashboard
export const getData = async (req, res) => {
    const [actual] = await obtenerVentasPorIntervalo(1);
    const [anterior] = await obtenerVentasPorIntervalo(2);
    const datosSeparadosActual = separarDatos(actual, "actual");
    const datosSeparadosAnterior = separarDatos(anterior, "anterior");
    console.log("datos separados actual:", datosSeparadosActual);
    let data = unirDatos(datosSeparadosActual, datosSeparadosAnterior);
    data = data.map(item => {
        const incremento = calcularIncrementoPorcentual(item.valorN, item.anterior);
        return {
            ...item,
            incrementoPorcentual: incremento
        };
    });
    //ingreso por mes
    const totalIngresoActual = ingresoMes(datosSeparadosActual, 'totalVentas', 'totalCantidad');
    const totalIngresoAnterior = ingresoMes(datosSeparadosAnterior, 'totalVentas', 'totalCantidad');
    const incrementoIngreso = calcularIncrementoPorcentual(totalIngresoActual.totalIngreso, totalIngresoAnterior.totalIngreso);
    const incrementoProductos = calcularIncrementoPorcentual(totalIngresoActual.totalProductos, totalIngresoAnterior.totalProductos);
    //------------------
    const dataOrdenada = ordenamiento(data, 'valorN');
    const mayorIncremento = ordenamiento(data, 'incrementoPorcentual').slice(-5).reverse();
    //console.log("mayor incremento:", mayorIncremento);
    const top5 = dataOrdenada.slice(-5).reverse();
    //console.log("total ingreso mes:", totalIngresoActual);
    res.json({
        totalIngresoActual: totalIngresoActual,
        totalIngresoAnterior: totalIngresoAnterior,
        incrementoIngreso: incrementoIngreso,
        incrementoProductos: incrementoProductos,
        mayorIncremento: mayorIncremento,
        top5: top5
    });
}
function ordenamiento(arr, key) {
  if (arr.length <= 1) return arr;
  const pivote = arr[arr.length - 1];
  const menores = [];
  const mayores = [];
  for (let i = 0; i < arr.length - 1; i++) {
    //console.log("menor:", arr[i][key], "pivote:", pivote[key]);
    if (arr[i][key] < pivote[key]) {
      menores.push(arr[i]);
    } else {
      mayores.push(arr[i]);
    }
  }
  return [...ordenamiento(menores, key), pivote, ...ordenamiento(mayores, key)];
}

async function obtenerVentasPorIntervalo (fecha){
    try {
        const query = `CALL obtener_ventas_por_intervalo(?)`
        const [rows] = await pool.execute(query, [fecha]);
        return rows;
    } catch (error) {
        throw error;
    }
}

function unirDatos(datosActuales, datosAnteriores) {
  let juntos = [...datosActuales, ...datosAnteriores];
  juntos.sort((a, b) => a.nombre.localeCompare(b.nombre));
  const result = Object.values(
    juntos.reduce((acc, item) => {
        if (!acc[item.nombre]) {
        acc[item.nombre] = { 
            nombre: item.nombre,
            cantidad: 0,
            anterior: 0,
            valorN: 0,
            fechaMesActual: "",
            fechaMesAnterior: ""
        };
        }
        if (item.valor === 'actual') {
            acc[item.nombre].cantidad = item.totalCantidad;
            acc[item.nombre].valorN = item.totalVentas;
            acc[item.nombre].fechaMesActual = item.fecha;
        } else if (item.valor === 'anterior') {
            acc[item.nombre].anterior = item.totalVentas;
            acc[item.nombre].fechaMesAnterior = item.fecha;
        }
        
        return acc;
    }, {})
  )
    return result;
}
//ingresos por mes, productos mas vendidos,
function ingresoMes(datos, key1, key2){
    let totalIngreso = 0;
    let totalProductos = 0;
    datos.forEach(element => {
        totalIngreso += element[key1];
        totalProductos += element[key2];
    });
    return {
        totalIngreso: Math.round(totalIngreso * 100) / 100,
        totalProductos: totalProductos
    };
}

function separarDatos(datos, valor){
    const resultado = Object.values(
        datos.reduce((acc, item) => {
            const key = item.nombre;
            if (!acc[key]) {
                acc[key] = { 
                    nombre: item.nombre, 
                    totalCantidad: 0, 
                    totalVentas: 0
                };
            }
            acc[key].fecha = item.fecha;
            acc[key].totalCantidad += item.cantidad;
            acc[key].totalVentas += item.precio * item.cantidad;
            acc[key].valor = valor;
            acc[key].totalVentas = Math.round(acc[key].totalVentas * 100) / 100;
            return acc;
        }, {})
    )
    return resultado;
}

//calcular incremento pórcentual
function calcularIncrementoPorcentual(valorN, valorO){
    //formula (vn-vo)/vo*100 don de vo tiene que ser diferente de 0
    if (!(valorO === 0)){
        const porcentaje = ((valorN - valorO)/valorO)*100
        return Math.round(porcentaje * 100) / 100;
    }
    return 100;
}

//despues pasasr para que obtenerVentasPorIntervalo se guarde en cahe y se ejecute cada 5 minutos


function getDate(){
    const date = new Date();
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
}
import express from 'express';
import cors from 'cors';
import session from'express-session';
import { secret_session, expire_session } from'../src/config/env.js';
import errorHandler from './middleware/error.middleware.js';


import productoRoutes from './routes/producto.routes.js';
import ventaRoutes from './routes/venta.routes.js';
import registrarRoutes from './routes/registrar.route.js';
import pdfRoutes from './routes/pdf/pdf.route.js';
import empleadoRoute from './routes/empleado.route.js';
import loginRoute from './routes/login.route.js';

const app = express();

app.use(cors());

app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb'}));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: "JSON inválido" });
  }
  next(err);
});
app.use(session({
  secret: secret_session,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}))




app.use('/login', loginRoute);
app.use('/product', productoRoutes);
app.use('/ventas', ventaRoutes);
app.use('/registrar', registrarRoutes);
app.use('/pdf', pdfRoutes);
app.use('/empleados', empleadoRoute);




app.use(errorHandler);

export default app;

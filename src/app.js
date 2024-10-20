import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import initializePassport from "./config/passport.config.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import config from './config/config.js';
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import userRouter from "./routes/user.routes.js";
import orderRouter from "./routes/order.routes.js";
import viewsRouter from "./routes/views.routes.js";
import sessionRouter from "./routes/session.routes.js";
import adminRouter from "./routes/admin.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { checkUserSession } from "./middlewares/auth.middleware.js";
import ProductManager from './dao/db/productManagerDb.js';
import { fileURLToPath } from 'url';
import path from 'path';
import "./db.js";
import bodyParser from 'body-parser';
import { repairCarts } from './utils/cartRepair.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongodbUri,
        ttl: 60 * 60
    }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(checkUserSession);

const productManager = new ProductManager();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use((req, res, next) => {
    // console.log('Session:', req.session);
    // console.log('User:', req.user);
    // console.log('User in session:', res.locals.user);
    next();
});

app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        formatNumber: (number, decimals = 2) => {
            if (number === null || number === undefined || isNaN(number)) {
                return 'N/A';
            }
            return Number(number).toFixed(decimals);
        },
        eq: (v1, v2) => v1 === v2,
        or: (v1, v2) => v1 || v2,
        gt: (a, b) => a > b,
        and: (v1, v2) => v1 && v2,
        not: v => !v,
        ternary: (cond, v1, v2) => cond ? v1 : v2,
        formatDate: (date) => new Date(date).toLocaleString()
    }
}));

app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use('/api/sessions', sessionRouter);
app.use('/admin', adminRouter);
app.use('/', viewsRouter);

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use(notFoundHandler);
app.use(errorHandler);

const httpServer = app.listen(config.port, async () => {
    //console.log(`Server running on http://localhost:${config.port}`);
    await repairCarts();
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    // console.log("Nuevo cliente conectado");

    const initialProducts = await productManager.getProducts(1, 15);
    socket.emit('products', initialProducts);

    socket.on('requestPage', async ({ page, limit, sort }) => {
        const products = await productManager.getProducts(page, limit, sort);
        
        socket.emit('products', products);
    });
});

export default app;
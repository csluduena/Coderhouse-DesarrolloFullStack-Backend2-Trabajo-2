# Guitar Store - Backend 2 (Entrega 4)

Programación Backend II: Diseño y Arquitectura Backend - CODERHOUSE

## Descripción del Proyecto

Este proyecto es la cuarta entrega del curso de Backend, avanzando con nuevas funcionalidades para una tienda online especializada en instrumentos musicales, principalmente guitarras. Se han implementado mejoras en la seguridad, autenticación, manejo de sesiones y carritos de compra para ofrecer una experiencia robusta y escalable.

Aplicación de Comercio Electrónico Guitar Store
===============================================

Descripción del Proyecto
------------------------

Este proyecto es la cuarta entrega del curso de `"Programación Backend II: Diseño y Arquitectura Backend"` para la academia `CoderHouse`. El mismo consta de una tienda en línea especializada en la venta de guitarras y otros instrumentos musicales. La aplicación ofrece diversas funcionalidades avanzadas, como autenticación, gestión de productos, carrito de compras, procesamiento de pedidos, y un panel de administración para gestionar el stock de productos.

Estructura del Proyecto
-----------------------

La aplicación sigue una estructura MVC (Modelo-Vista-Controlador), junto con capas adicionales para la gestión de datos y lógica de negocio. A continuación, se describen los directorios principales:

-   **`src/`**: Directorio raíz del código fuente.
    -   **`controllers/`**: Archivos de controladores para manejar la lógica de negocio.
    -   **`dao/`**: Capa de acceso a datos (DAO) para la interacción con la base de datos.
        -   **`db/`**: Implementaciones específicas de la base de datos.
        -   **`models/`**: Definiciones de esquemas de Mongoose.
        -   **`repositories/`**: Implementaciones del patrón de repositorio para abstracción de base de datos.
    -   **`dto/`**: Definiciones de Objetos de Transferencia de Datos (DTO).
    -   **`middlewares/`**: Funciones middleware personalizadas, como autenticación y autorización.
    -   **`public/`**: Recursos estáticos (CSS, JavaScript del cliente, imágenes).
    -   **`routes/`**: Definiciones de rutas de Express para las APIs y vistas.
    -   **`services/`**: Lógica de negocio centralizada.
    -   **`utils/`**: Funciones de utilidad y helpers.
    -   **`views/`**: Plantillas Handlebars para renderizar las vistas del cliente.

Características Principales
---------------------------

1.  **Modelo de Usuario Mejorado**:

    -   Campos como `first_name`, `last_name`, `email`, `age`, `password`, `cart`, `role`.
    -   Generación automática de un carrito al registrarse.
    -   Contraseñas encriptadas con **bcrypt** para mayor seguridad.
2.  **Autenticación**:

    -   Autenticación basada en JWT (JSON Web Tokens) y gestión de sesiones con Passport.js.
    -   Separación de rutas para usuarios autenticados en la web y para APIs.
    -   Uso de tokens de autenticación extraídos de cookies.
3.  **Gestión de Productos**:

    -   CRUD completo para productos con soporte para paginación y filtrado.
    -   Actualización de stock mediante el panel de administración.
4.  **Carrito de Compras**:

    -   Funcionalidad para agregar, eliminar y modificar productos en el carrito.
    -   Manejo de la cantidad de productos y cálculo total en tiempo real.
5.  **Procesamiento de Pedidos**:

    -   Generación de tickets de compra con detalles de los productos adquiridos.
    -   Funcionalidad de "Finalizar Compra" que actualiza el stock de los productos comprados.
6.  **Panel de Administración**:

    -   Gestión de productos y stock para administradores.
    -   Implementación de un sistema de autorización basado en roles (admin y usuario).

Endpoints Clave
---------------

### Admin

-   `GET /admin/stock/update`: Update stock.
-   `GET /admin/categories`: Get all categories.

### Cart

-   `POST /api/carts/add`: Add item to cart.
-   `DELETE /api/carts/remove/{itemId}`: Remove item from cart.
-   `GET /api/carts/count`: Get cart item count.
-   `PUT /api/carts/update/{itemId}`: Update cart item quantity.
-   `DELETE /api/carts/clear`: Clear all items from the cart.
-   `POST /api/carts/finalize`: Finalize purchase and create order.
-   `GET /api/carts/{cId}`: Get user's cart.

### Products

-   `GET /api/products`: Get all products.
-   `GET /api/products/{pid}`: Get a product by ID.
-   `PUT /api/products/{pid}`: Update a product.
-   `DELETE /api/products/{pid}`: Delete a product.

### Users Session

-   `POST /api/sessions/login`: Login user.
-   `POST /api/sessions/logout`: Logout current user.

### Users

-   `POST /api/users/register`: Register a new user.
-   `GET /api/users/profile`: Get user profile.
-   `PUT /api/users/profile`: Update user profile.
-   `DELETE /api/users`: Delete user account.


Tecnologías Utilizadas
----------------------

-   **Backend**: Node.js con Express.js.
-   **Base de Datos**: MongoDB utilizando Mongoose como ODM.
-   **Autenticación**: Passport.js con JWT para la gestión de sesiones.
-   **Vistas**: Handlebars para el renderizado dinámico de HTML.
-   **Seguridad**: bcrypt para encriptación de contraseñas.
-   **Comunicación en Tiempo Real**: Socket.io para interacción cliente-servidor en tiempo real.
-   **Manejo de Sesiones**: express-session y cookie-parser.
-   **Variables de Entorno**: dotenv para configuración de entornos.

Instalación y Configuración
---------------------------

1.  **Clonar el repositorio**:

    bash

    Copiar código

    `git clone https://github.com/csluduena/Coderhouse-DesarrolloFullStack-Backend2-Trabajo-2.git`

2.  **Instalar dependencias**:

    bash

    Copiar código

    `cd Coderhouse-DesarrolloFullStack-Backend2-Trabajo-2
    npm install`

3.  **Configurar variables de entorno**: Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

    bash

    Copiar código

    `MONGODB_URI=tu_uri_de_mongodb
    JWT_SECRET=tu_secreto_jwt
    SESSION_SECRET=tu_secreto_de_sesion
    PORT=8080`

4.  **Iniciar el servidor**:

    bash

    Copiar código

    `npm run dev`

Uso
---

Una vez iniciado el servidor, la aplicación web estará disponible en `http://localhost:8080`. También se pueden realizar pruebas con Postman para verificar los endpoints, especialmente los que requieren autenticación mediante tokens JWT.

Scripts Útiles
--------------

### Asignar Rol de Administrador

Un script para asignar el rol de administrador a un usuario ya registrado en la base de datos.

bash

Copiar código

`node src/utils/setAdmin.js <userId>`

### Reparar Carritos

Un script para corregir carritos en la base de datos que puedan tener productos no definidos.

bash

Copiar código

`node src/utils/cartRepair.js`

Consideraciones
---------------

1.  **Autenticación y Roles**: Solo los usuarios autenticados con el rol de "admin" pueden acceder al panel de administración.
2.  **Manejo de Errores**: Se implementa un manejo centralizado de errores con mensajes específicos y códigos de estado HTTP claros.
3.  **Seguridad**: Las contraseñas están encriptadas y los tokens de sesión tienen un tiempo de expiración configurable.

Implementaciones Técnicas Destacadas
------------------------------------

### DTOs (Data Transfer Objects)

Se utilizan DTOs para asegurar que los datos enviados entre las capas de la aplicación estén correctamente formateados.

javascript

Copiar código

`// src/dto/product.dto.js
export class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.img = product.img;
        this.stock = product.stock;
    }
}`

### Repositorios y Patrones de Diseño

El uso de patrones como DAO y repositorio permite una abstracción clara para las operaciones de base de datos:

javascript

Copiar código

`// src/dao/repositories/product.repository.js
export class ProductRepository {
    async findById(id) {
        return await Product.findById(id);
    }

    // Otros métodos de CRUD
}`

### Procesamiento de Pedidos y Tickets

Un modelo específico para tickets de compra se ha implementado para registrar las transacciones exitosas.

### Gestión de Stock para Administradores

Los administradores pueden actualizar el stock de productos mediante una interfaz fácil de usar en `/admin/stock`, donde seleccionan productos y ajustan cantidades.

Conclusión
----------

El proyecto Guitar Store ha evolucionado significativamente con nuevas características, una estructura modular y una arquitectura escalable. Las mejoras incluyen autenticación segura, gestión avanzada de carritos, y un sistema robusto para la administración de productos. Las próximas mejoras podrían incluir filtros de productos más avanzados, reseñas de usuarios y la integración con pasarelas de pago.

```
GuitarStore4-2
├─ .gitignore
├─ INFO ENV Y MONGODB.txt
├─ package-lock.json
├─ package.json
├─ README.md
└─ src
   ├─ app.js
   ├─ config
   │  ├─ config.js
   │  └─ passport.config.js
   ├─ controllers
   │  ├─ admin.controller.js
   │  ├─ cart.controller.js
   │  ├─ order.controller.js
   │  ├─ product.controller.js
   │  ├─ user.controller.js
   │  └─ view.controller.js
   ├─ dao
   │  ├─ db
   │  │  ├─ cartManagerDb.js
   │  │  └─ productManagerDb.js
   │  ├─ models
   │  │  ├─ cart.model.js
   │  │  ├─ order.model.js
   │  │  ├─ product.model.js
   │  │  ├─ ticket.model.js
   │  │  └─ user.model.js
   │  └─ repositories
   │     ├─ cart.repository.js
   │     ├─ product.repository.js
   │     ├─ ticket.repository.js
   │     └─ user.repository.js
   ├─ db.js
   ├─ dto
   │  ├─ cart.dto.js
   │  ├─ product.dto.js
   │  └─ user.dto.js
   ├─ middlewares
   │  ├─ auth.middleware.js
   │  └─ error.middleware.js
   ├─ public
   │  ├─ css
   │  │  └─ style.css
   │  ├─ img
   │  │  └─ directorioDeImagenes.png
   │  └─ js
   │     ├─ main.js
   │     └─ rockAlerts.js
   ├─ routes
   │  ├─ admin.routes.js
   │  ├─ cart.routes.js
   │  ├─ order.routes.js
   │  ├─ products.routes.js
   │  ├─ session.routes.js
   │  ├─ user.routes.js
   │  └─ views.routes.js
   ├─ services
   │  └─ email.service.js
   ├─ utils
   │  ├─ admin-stock.js
   │  ├─ errorCodes.js
   │  ├─ setAdmin.js
   │  └─ util.js
   └─ views
      ├─ admin
      │  └─ stock.handlebars
      ├─ layouts
      │  └─ main.handlebars
      ├─ cart.handlebars
      ├─ current-session.handlebars
      ├─ error.handlebars
      ├─ home.handlebars
      ├─ login.handlebars
      ├─ newstock.handlebars
      ├─ productDetails.handlebars
      ├─ products.handlebars
      ├─ profile.handlebars
      ├─ register.handlebars
      ├─ success.handlebars
      └─ ticket.handlebars
```
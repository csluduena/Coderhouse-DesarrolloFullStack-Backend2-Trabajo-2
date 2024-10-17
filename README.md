# Guitar Store - Backend 2 (Entrega 4)

## Descripción del Proyecto

Este proyecto es la continuación y cuarta entrega del curso de Backend, ahora para Backend 2. Guitar Store es una aplicación de comercio electrónico especializada en instrumentos musicales, específicamente guitarras. Esta versión incorpora funcionalidades avanzadas de autenticación, manejo de sesiones y gestión de carritos de compra.

## Características Principales

1. **Modelo de Usuario Mejorado**:
   - Campos: `first_name`, `last_name`, `email`, `age`, `password`, `cart`, `role`.
   - Generación automática de carrito al registrarse.

2. **Seguridad Mejorada**:
   - Encriptación de contraseñas utilizando bcrypt.

3. **Autenticación Avanzada**:
   - Implementación de estrategias de Passport.
   - Sistema de login con JWT (JSON Web Tokens).

4. **Manejo de Sesiones**:
   - Estrategia "current" para extraer y validar tokens de cookies.
   - Rutas separadas para validación de usuarios en web y API.

5. **Gestión de Carritos**:
   - Modelo de carrito con campos `id` y `productos`.
   - Funcionalidades para agregar, eliminar y obtener productos del carrito de un usuario.

## Endpoints

### Sesiones y Autenticación

- `POST /api/sessions/register`: Registro de nuevos usuarios.
- `POST /api/sessions/login`: Inicio de sesión.
- `POST /api/sessions/logout`: Cierre de sesión.
- `GET /api/sessions/current`: Obtener información del usuario actual (versión web).
- `GET /api/sessions/current-api`: Obtener información del usuario actual (para Postman, requiere bearer token).

### Carritos

- `GET /api/carts/:cid`: Obtener un carrito específico (requiere bearer token).
- `GET /api/carts`: Listar todos los carritos (requiere bearer token).
- `DELETE /api/carts/:cid`: Eliminar un carrito (requiere bearer token).
- `POST /api/carts/:cid/products/:pid`: Agregar un producto a un carrito (requiere bearer token).
- `DELETE /api/carts/:cid/products/:pid`: Eliminar un producto de un carrito (requiere bearer token).

### Productos

- `GET /api/products`: Listar todos los productos.
- `GET /api/products/:pid`: Obtener un producto específico.
- `PUT /api/products/:pid`: Actualizar un producto (requiere bearer token).

### Usuarios

- `DELETE /api/users/`: Eliminar un usuario (requiere bearer token).

## Tecnologías Utilizadas

- Node.js
- Express.js
- MongoDB con Mongoose
- Passport.js
- JWT para autenticación
- bcrypt para encriptación
- Handlebars para vistas
- Socket.io para comunicación en tiempo real
- dotenv para manejo de variables de entorno
- cookie-parser para manejo de cookies
- express-session para manejo de sesiones

## Instalación y Configuración

1. Clonar el repositorio:
    git clone [https://github.com/csluduena/guitar-store-backend.git](https://github.com/csluduena/guitar-store-backend.git)
2. Instalar dependencias:
    cd guitar-store-backend npm install
3. Configurar variables de entorno:
    Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
        MONGODB_URI=tu_uri_de_mongodb
        JWT_SECRET=tu_secreto_jwt
        SESSION_SECRET=tu_secreto_de_sesion
        PORT=8080
4. Iniciar el servidor:
    npm run dev

## Uso

Una vez iniciado el servidor, puedes acceder a la aplicación web a través de `http://localhost:8080`

Para pruebas con Postman:

- Usa `http://localhost:8080/api/sessions/current-api` para obtener información del usuario actual
- Para endpoints que requieren autenticación, incluye el bearer token en el header de la solicitud.

## Contribución

Si deseas contribuir al proyecto, por favor:

1. Haz un fork del repositorio.
2. Crea una nueva rama para tu feature (`git checkout -b feature/AmazingFeature`).
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Push a la rama (`git push origin feature/AmazingFeature`).
5. Abre un Pull Request.

## Contacto

Sebastian Ludueña - [@csluduena](https://linkedin.com/in/csluduena)

Sitio Web: [www.csluduena.com.ar](https://www.csluduena.com.ar)

GitHub: [github.com/csluduena](https://github.com/csluduena)

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Guitar Store Project Overview

## Project Structure

The project follows a typical MVC (Model-View-Controller) structure:

- `src/`
  - `controllers/`: Contains logic for handling requests
  - `dao/`: Data Access Objects for database operations
  - `models/`: Mongoose schemas for database models
  - `routes/`: Express routes for different API endpoints
  - `views/`: Handlebars templates for rendering pages
  - `middlewares/`: Custom middleware functions
  - `utils/`: Utility functions and constants
  - `config/`: Configuration files
  - `public/`: Static assets (CSS, client-side JS)

## Key Implementations

1. **User Authentication**
   - JWT-based authentication
   - GitHub OAuth integration

2. **Product Management**
   - CRUD operations for products
   - Pagination and sorting

3. **Shopping Cart**
   - Add/remove items
   - Update quantities

4. **Order Processing**
   - Create orders from cart items
   - Generate tickets for successful purchases

5. **Error Handling**
   - Centralized error handling middleware

6. **Data Transfer Objects (DTOs)**
   - Implemented for User and Product models

7. **Repositories**
   - Added for Product, User, and Ticket models

## Notable Changes

1. Implemented the Ticket model and related functionality
2. Added a finalize purchase route in cart controller
3. Updated views to support new features (e.g., success page after purchase)
4. Improved error handling and added more specific error messages
5. Implemented role-based authorization (admin and user roles)

## Example of New Implementation: Ticket Model

This model represents a purchase ticket, storing information about each successful transaction.

## Conclusion

The Guitar Store project has been significantly enhanced with new features and improved architecture. The implementation of DTOs, repositories, and the ticket system has made the application more robust and scalable. Future improvements could include more advanced product filtering, user reviews, and integration with payment gateways.


```
FUNCIONAL
├─ .git
│  ├─ COMMIT_EDITMSG
│  ├─ config
│  ├─ description
│  ├─ FETCH_HEAD
│  ├─ HEAD
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ push-to-checkout.sample
│  │  ├─ sendemail-validate.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ logs
│  │  ├─ HEAD
│  │  └─ refs
│  │     ├─ heads
│  │     │  └─ main
│  │     └─ remotes
│  │        └─ origin
│  │           └─ main
│  ├─ ORIG_HEAD
│  └─ refs
│     ├─ heads
│     │  └─ main
│     ├─ remotes
│     │  └─ origin
│     │     └─ main
│     └─ tags
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
   │  │  ├─ acoustic.png
   │  │  ├─ Alexi-Hexed-1.jpg
   │  │  ├─ banner.png
   │  │  ├─ bass.png
   │  │  ├─ bgt.png
   │  │  ├─ bgtB - copia.png
   │  │  ├─ brands
   │  │  │  ├─ epiphone-logo.png
   │  │  │  ├─ fender-logo.png
   │  │  │  ├─ gibson-logo.png
   │  │  │  ├─ ibanez-logo.png
   │  │  │  └─ jackson-logo.png
   │  │  ├─ carpiLoco.gif
   │  │  ├─ carrito.png
   │  │  ├─ carritoICO.png
   │  │  ├─ carritoICO2.png
   │  │  ├─ electricas.jpg
   │  │  ├─ ESP-LTD-Alexi-Hexed.png
   │  │  ├─ esp-ltd-kh-v-rdsp-kirk-hammett-guitarra-electrica-red-sparkle.jpg
   │  │  ├─ esp-ltd-kh-v-rdsp-kirk-hammett-red-sparkle.png
   │  │  ├─ fender-american-BurstRW.png
   │  │  ├─ GibsonLesPaul50sTribute2016T.png
   │  │  ├─ GibsonLesPaulStudio2016T.png
   │  │  ├─ GibsonLesPaulTraditional2016T.png
   │  │  ├─ GibsonSGFaded2016T.png
   │  │  ├─ GibsonSGStandard2016T.png
   │  │  ├─ guitarBann.gif
   │  │  ├─ guitarBannW.gif
   │  │  ├─ guitarBannW2.gif
   │  │  ├─ photo-1516924962500-2b4b3b99ea02.avif
   │  │  ├─ PlayerStrat3-ColourSunburstPF.png
   │  │  ├─ rock-background.png
   │  │  ├─ wallG.jpg
   │  │  ├─ wallG2.png
   │  │  ├─ wallGBlurred.jpg
   │  │  └─ wallGBlurred.png
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
      ├─ cart.handlebars
      ├─ current-session.handlebars
      ├─ error.handlebars
      ├─ home.handlebars
      ├─ layouts
      │  └─ main.handlebars
      ├─ login.handlebars
      ├─ newstock.handlebars
      ├─ productDetails.handlebars
      ├─ products.handlebars
      ├─ profile.handlebars
      ├─ register.handlebars
      ├─ success.handlebars
      └─ ticket.handlebars

```
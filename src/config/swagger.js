import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'guitarstore4.2',
            version: '4.2.0',
            description: 'API para la tienda de guitarras online',
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Servidor de desarrollo',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app, port) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    //console.log(`Documentación de Swagger disponible en http://localhost:${port}/api-docs`);
};
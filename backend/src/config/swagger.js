import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HealthVision API',
            version: '1.0.0',
            description: 'API documentation for HealthVision application',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Local server',
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);

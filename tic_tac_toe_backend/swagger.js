const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tic Tac Toe Backend',
      version: '1.0.0',
      description:
        'Express API for Tic Tac Toe with user auth, game management, moves, and history.',
    },
    tags: [
      { name: 'Health', description: 'Service health check' },
      { name: 'Auth', description: 'User registration and login' },
      { name: 'Games', description: 'Game creation, joining, state' },
      { name: 'Moves', description: 'Submit and retrieve moves' },
      { name: 'History', description: 'Game history retrieval' },
      { name: 'Realtime', description: 'Real-time updates (structure only)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'JWT token returned by login. Include as "Authorization: Bearer <token>".',
        },
      },
      schemas: {
        UserRegisterRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', example: 'alice' },
            password: { type: 'string', example: 'StrongP@ssw0rd' },
          },
        },
        UserLoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', example: 'alice' },
            password: { type: 'string', example: 'StrongP@ssw0rd' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' },
              },
            },
          },
        },
        CreateGameRequest: {
          type: 'object',
          properties: {
            as: {
              type: 'string',
              enum: ['X', 'O'],
              description: 'Preferred side. If omitted, defaults to X.',
            },
          },
        },
        JoinGameRequest: {
          type: 'object',
          required: ['gameId'],
          properties: {
            gameId: { type: 'string' },
          },
        },
        MoveRequest: {
          type: 'object',
          required: ['gameId', 'row', 'col'],
          properties: {
            gameId: { type: 'string' },
            row: { type: 'integer', minimum: 0, maximum: 2 },
            col: { type: 'integer', minimum: 0, maximum: 2 },
          },
        },
        Game: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            board: {
              type: 'array',
              items: {
                type: 'array',
                items: { type: 'string', enum: ['X', 'O', ''] },
              },
            },
            players: {
              type: 'object',
              properties: {
                X: { type: 'string', nullable: true },
                O: { type: 'string', nullable: true },
              },
            },
            nextTurn: { type: 'string', enum: ['X', 'O'] },
            status: {
              type: 'string',
              enum: ['WAITING', 'IN_PROGRESS', 'X_WON', 'O_WON', 'DRAW'],
            },
            moves: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  row: { type: 'integer' },
                  col: { type: 'integer' },
                  player: { type: 'string', enum: ['X', 'O'] },
                  at: { type: 'string', format: 'date-time' },
                },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;

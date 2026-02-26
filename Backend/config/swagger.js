const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Walk n Earn API",
    version: "1.0.0",
    description: "Manual OpenAPI spec for Walk n Earn backend",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local server",
    },
  ],
  tags: [
    { name: "Leaderboard", description: "Leaderboard management APIs" },
    { name: "Users", description: "User management APIs" },
    { name: "Walking", description: "Walking trip APIs" },
    { name: "Login", description: "Authentication APIs" },
  ],
  paths: {
    "/api/leaderboard": {
      post: {
        summary: "Create or update weekly leaderboard",
        tags: ["Leaderboard"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userId", "points", "distance", "emission"],
                properties: {
                  userId: { type: "string", example: "65f1a2c4e4b0f123456789ab" },
                  points: { type: "number", example: 50 },
                  distance: { type: "number", example: 5.2 },
                  emission: { type: "number", example: 1.3 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Leaderboard updated successfully" },
          400: { description: "Validation error" },
        },
      },
    },

    "/api/leaderboard/top": {
      get: {
        summary: "Get top 10 users for current week",
        tags: ["Leaderboard"],
        responses: {
          200: { description: "List of top 10 users" },
        },
      },
    },

    "/api/leaderboard/rank/{userId}": {
      get: {
        summary: "Get specific user's weekly rank",
        tags: ["Leaderboard"],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User MongoDB ID",
          },
        ],
        responses: {
          200: { description: "User rank details" },
          404: { description: "User not found" },
        },
      },
    },

    "/api/leaderboard/{id}": {
      put: {
        summary: "Admin update weekly points manually",
        tags: ["Leaderboard"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Leaderboard record ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  newPoints: { type: "number", example: 120 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Record updated successfully" },
          404: { description: "Record not found" },
        },
      },

      delete: {
        summary: "Delete leaderboard record",
        tags: ["Leaderboard"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Leaderboard record ID",
          },
        ],
        responses: {
          200: { description: "Record deleted successfully" },
          404: { description: "Record not found" },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
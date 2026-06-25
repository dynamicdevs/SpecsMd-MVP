export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Friccion Cero API",
    version: "0.1.0",
    description: "Backend API for registering, measuring, and prioritizing operational friction."
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "Backend is running"
          }
        }
      }
    },
    "/api/frictions": {
      get: {
        summary: "List frictions",
        responses: {
          "200": {
            description: "Friction list"
          }
        }
      },
      post: {
        summary: "Create friction",
        responses: {
          "201": {
            description: "Friction created"
          },
          "400": {
            description: "Validation error"
          }
        }
      }
    },
    "/api/dashboard": {
      get: {
        summary: "Get dashboard metrics",
        responses: {
          "200": {
            description: "Dashboard totals, grouped counts, and most costly frictions"
          }
        }
      }
    },
    "/api/frictions/{id}": {
      get: {
        summary: "Get friction detail",
        responses: {
          "200": {
            description: "Friction detail"
          },
          "404": {
            description: "Friction not found"
          }
        }
      },
      put: {
        summary: "Update friction",
        responses: {
          "200": {
            description: "Friction updated"
          },
          "400": {
            description: "Validation error"
          },
          "404": {
            description: "Friction not found"
          }
        }
      },
      delete: {
        summary: "Delete friction",
        responses: {
          "204": {
            description: "Friction deleted"
          },
          "404": {
            description: "Friction not found"
          }
        }
      }
    },
    "/api/frictions/{id}/comments": {
      get: {
        summary: "List friction comments",
        responses: {
          "200": {
            description: "Comment list"
          },
          "404": {
            description: "Friction not found"
          }
        }
      },
      post: {
        summary: "Create friction comment",
        responses: {
          "201": {
            description: "Comment created"
          },
          "400": {
            description: "Validation error"
          },
          "404": {
            description: "Friction not found"
          }
        }
      }
    },
    "/api/frictions/{frictionId}/initiatives": {
      post: {
        summary: "Create initiative from friction",
        responses: {
          "201": {
            description: "Initiative created"
          },
          "400": {
            description: "Validation error"
          },
          "404": {
            description: "Friction not found"
          }
        }
      }
    },
    "/api/initiatives": {
      get: {
        summary: "List initiatives",
        responses: {
          "200": {
            description: "Initiative list with friction context"
          }
        }
      }
    },
    "/api/initiatives/{id}": {
      get: {
        summary: "Get initiative detail",
        responses: {
          "200": {
            description: "Initiative detail with friction context"
          },
          "404": {
            description: "Initiative not found"
          }
        }
      },
      put: {
        summary: "Update initiative",
        responses: {
          "200": {
            description: "Initiative updated"
          },
          "400": {
            description: "Validation error"
          },
          "404": {
            description: "Initiative not found"
          }
        }
      },
      delete: {
        summary: "Delete initiative",
        responses: {
          "204": {
            description: "Initiative deleted"
          },
          "404": {
            description: "Initiative not found"
          }
        }
      }
    }
  }
};

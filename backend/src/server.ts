import app from "./app";

const port = Number(process.env.PORT || 8080);

// Start server and handle graceful startup
const server = app.listen(port, () => {
  console.log("Express server started on port: " + port);
  
  // In CI environments, ensure the process signals readiness
  if (process.env.CIRCLECI || process.env.CI) {
    console.log("Server is ready for connections");
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

// ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "lfftt-backend",
      script: "./backend/server.js",
      watch: process.env.NODE_ENV !== 'production', // Watch only in dev
      env: {
        NODE_ENV: "development",
        PORT: 5000,
        MONGODB_URI: "mongodb://localhost:27017/lfftt"
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
        MONGODB_URI: "mongodb+srv://<username>:<password>@cluster0.mongodb.net/lfftt?retryWrites=true&w=majority"
        // 🔁 Replace <username> and <password> with your MongoDB Atlas credentials
      }
    }
  ]
};

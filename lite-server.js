module.exports = {
  port: 12380,
  server: {
    baseDir: "./dist",
    middleware: {
      // overrides the 0:th middleware default with new settings
      0: null
    }
  }
};

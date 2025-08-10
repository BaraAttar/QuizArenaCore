// middlewares/apiLogger.js
const apiLogger = (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    return next(); 
  } 

  const start = Date.now();
  const path = req.path;

  // لحفظ الرد قبل إرساله
  let capturedResponse;

  // حفظ الدالة الأصلية
  const originalJson = res.json;

  // إعادة تعريف res.json
  res.json = function (body, ...args) {
    capturedResponse = body;
    return originalJson.call(this, body, ...args);
  };

  // عند انتهاء الرد
  res.on("finish", () => {
    const duration = Date.now() - start;

    if (path.startsWith("/")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

      if (capturedResponse) {
        try {
          const shortResponse = JSON.stringify(capturedResponse);
          logLine += ` :: ${shortResponse}`;
        } catch (_) {
          // تجاهل الأخطاء
        }
      }

      if (logLine.length > 150) {
        logLine = logLine.slice(0, 149) + "…";
      }

      console.log(logLine);
    }
  });

  next();
};

module.exports = apiLogger;
 
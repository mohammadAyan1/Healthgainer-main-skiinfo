const { v4: uuidv4 } = require("uuid");

// Middleware: check or create sessionId
function sessionMiddleware(req, res, next) {
  let sessionId = req.cookies.sessionId;

  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie("sessionId", sessionId, {
      httpOnly: true, // JS से access नहीं कर सकते
      secure: true, // सिर्फ https में
      sameSite: "lax", // CSRF से बचाव
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
  }

  req.sessionId = sessionId;
  next();
}

module.exports = sessionMiddleware;

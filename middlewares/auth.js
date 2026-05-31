// Shared authentication guards used by the controllers (API) and app.js (pages).
export function requireApiAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export function requirePageAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/user/login");
  }
  next();
}

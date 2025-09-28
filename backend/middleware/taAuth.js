export const isTAAuthenticated = (req, res, next) => {
  if (req.session && req.session.taUser && req.session.taUser.role === 'ta') {
    req.user = {
      _id: req.session.taUser._id || req.session.taUser.id,
      ...req.session.taUser
    };
    return next();
  }
  res.status(401).json({ error: "TA authentication required" });
};

export default (req) => Promise.resolve({ user: req.session.user || null });

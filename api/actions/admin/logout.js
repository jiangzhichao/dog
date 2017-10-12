export default (req) => new Promise((resolve) => {
    req.token = null;
    return resolve(null);
});

function dashboardAuth(req, res, next) {
  const expectedUser = process.env.DASHBOARD_USER || 'admin';
  const expectedPassword = process.env.DASHBOARD_PASSWORD;

  if (!expectedPassword) {
    return res.status(500).send('DASHBOARD_PASSWORD is not set on the server.');
  }

  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');

  if (scheme === 'Basic' && encoded) {
    const [user, password] = Buffer.from(encoded, 'base64').toString().split(':');
    if (user === expectedUser && password === expectedPassword) {
      return next();
    }
  }

  res.set('WWW-Authenticate', 'Basic realm="Video Link Tracker"');
  return res.status(401).send('Authentication required.');
}

module.exports = { dashboardAuth };

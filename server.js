require('dotenv').config();
const express = require('express');
const path = require('path');

const embedRoutes = require('./routes/embed');
const trackRoutes = require('./routes/track');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.redirect('/dashboard'));

app.use(embedRoutes);
app.use(trackRoutes);
app.use(dashboardRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Video Link Tracker listening on port ${port}`));

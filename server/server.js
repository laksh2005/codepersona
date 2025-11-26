require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('DB connected'))
.catch(err => console.error('DB connection error:', err));

// CORS middleware
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

app.use(express.json());

// Mount routes
app.use('/api/github', require('./routes/github'));
app.use('/api/journey', require('./routes/journey'));

app.get('/', (req, res) => res.send('journey backend'));

if (require.main === module) {
	app.listen(port, () => console.log(`server running on port ${port}`));
}

module.exports = app;

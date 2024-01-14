const fs = require('fs');

//express
const express = require('express');

const app = express();

// //HTTP GET
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// //HTTP POST
// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//Route Handler
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    //JSend data specification
    status: 'success',

    //results is not JSend data specification
    results: tours.length,

    data: { tours },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

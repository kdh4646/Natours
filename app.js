const fs = require('fs');

//express
const express = require('express');

const app = express();

//middleware
app.use(express.json());

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

//Get specific tour information
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  //convert to number
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  //validation
  //if (id > tours.length)
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

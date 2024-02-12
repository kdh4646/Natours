//Get Overview
exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
};

//Get Tour
exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
};

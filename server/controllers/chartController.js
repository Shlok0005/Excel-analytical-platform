const Chart = require('../models/Chart');

// @desc    Save a chart configuration
// @route   POST /api/charts
exports.saveChart = async (req, res) => {
  try {
    const { title, chartType, data, options } = req.body;

    const newChart = new Chart({
      user: req.user.id,
      title,
      chartType,
      data,
      options,
    });

    const chart = await newChart.save();
    res.json(chart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all of a user's saved charts
// @route   GET /api/charts
exports.getCharts = async (req, res) => {
  try {
    const charts = await Chart.find({ user: req.user.id }).sort({ savedAt: -1 });
    res.json(charts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

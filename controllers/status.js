const Report = require('../models/reports');

// Function to fetch filtered reports based on status
module.exports.filteredReports = async function(req, res) {
  try {
    const { status } = req.params;

    const reports = await Report.find({ status });

    return res.status(200).json({
      message: `List of Reports with status ${status}`,
      reports: reports,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

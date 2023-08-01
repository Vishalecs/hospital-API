const Report = require('../models/reports');
const User = require('../models/user');

// Function to register a patient
module.exports.register = async function(req, res) {
  try {
    const { number, name } = req.body;

    let user = await User.findOne({ username: number });

    if (user) {
      return res.status(200).json({
        message: 'User Already Registered',
        data: {
          user: user,
        },
      });
    }

    user = await User.create({
      username: number,
      name: name,
      password: '12345', // You may want to handle password more securely
      type: 'Patient',
    });

    return res.status(201).json({
      message: 'Patient registered successfully',
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

// Function to create a report for a patient
module.exports.createReport = async function(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(422).json({
        message: 'Patient Does not exist',
      });
    }

    const { status } = req.body;

    const report = await Report.create({
      createdByDoctor: req.user.id,
      patient: req.params.id,
      status,
      date: new Date(),
    });

    user.reports.push(report);
    await user.save();

    return res.status(201).json({
      message: 'Report created successfully',
      data: report,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

// Function to fetch all reports of a patient
module.exports.patientReports = async function(req, res) {
  try {
    const reports = await Report.find({ patient: req.params.id })
      .populate('createdByDoctor')
      .sort('date');

    const reportData = reports.map(report => {
      const originalDate = report.date;
      const dateObj = new Date(originalDate);

      const formattedDate = dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      return {
        createdByDoctor: report.createdByDoctor.name,
        status: report.status,
        date: formattedDate,
      };
    });

    return res.status(200).json({
      message: `List of Reports of User with id -  ${req.params.id}`,
      reports: reportData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

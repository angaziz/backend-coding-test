const packageJson = require('../../../../package');

module.exports = async (req, res, next) => {
  try {
    res.status(200).json({
      name: packageJson.name,
      version: packageJson.version,
    });
  } catch (error) {
    next(error);
  }
};

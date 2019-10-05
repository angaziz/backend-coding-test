module.exports = async (req, res, next) => {
  try {
    const rides = await req.app.locals.services.rides.getById(req.params.rideID);

    res.status(200).json(rides);
  } catch (error) {
    next(error);
  }
};

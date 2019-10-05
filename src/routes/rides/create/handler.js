module.exports = async (req, res, next) => {
  try {
    const createdRide = await req.app.locals.services.rides.create(req.body);

    res.status(200).json(createdRide);
  } catch (error) {
    next(error);
  }
};

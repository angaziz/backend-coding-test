module.exports = async (req, res, next) => {
  try {
    const rides = await req.app.locals.services.rides.getList(req.body);

    res.status(200).json(rides);
  } catch (error) {
    next(error);
  }
};

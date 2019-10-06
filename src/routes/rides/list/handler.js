module.exports = async (req, res, next) => {
  try {
    const rides = await req.app.locals.services.rides.getList(
      req.query.offset,
      req.query.limit,
    );

    res.status(200).json({
      paginationMeta: {
        offset: req.query.offset,
        limit: req.query.limit,
      },
      data: rides,
    });
  } catch (error) {
    next(error);
  }
};

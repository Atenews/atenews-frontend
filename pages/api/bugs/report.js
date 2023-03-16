
export default async (req, res) => {
  const {
    error,
  } = req.body;

  res.status(200).send({
    error,
    timestamp: new Date(),
  });
};

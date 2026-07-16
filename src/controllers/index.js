const index = async (req, res) => {
  const title = "Home";
  res.render("home", { title });
};

export { index };

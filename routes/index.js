const landingpageRoutes = require("./landingpage");
const homepageRoutes = require("./homepage");
const userRoutes = require("./user");
const bookRoutes = require("./book");
const constructorMethod = app => {
  app.use("/homepage", homepageRoutes); 
  app.use("/", landingpageRoutes);
  app.use("/user", userRoutes);
  app.use("/book", bookRoutes);
  app.use("*", (req, res) => {
    res.status(500).redirect('/homepage');
  });
};

module.exports = constructorMethod;

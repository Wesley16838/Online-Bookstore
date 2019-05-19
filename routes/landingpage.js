const express = require("express");
const router = express.Router();
const checkCookie = require('../middleware/check_cookie')

router.get("/", checkCookie,(req, res) => {
  res.status(200).render("Component/landingpage", {
    title:"Landing Page"
  });
});



module.exports = router;

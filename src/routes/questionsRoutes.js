const express = require('express');
const router = express.Router();

const {getQuestionsByCategory , postAnswers } = require("../controllers/questionsController")

router.get("/category/:categoryName" , getQuestionsByCategory)

router.post("/submit", postAnswers);


module.exports = router
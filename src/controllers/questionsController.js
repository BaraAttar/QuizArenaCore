const User = require("../models/User.js");
const Question = require("../models/Question");

// Literature : 20
// Programming : 20
// Religion : 20
// Geography : 20
// Physics : 20
// Astronomy : 20
// History : 20
// Technology : 20
// Science : 20
// Mathematics : 20
// Chemistry : 20
// Biology : 20

exports.getQuestionsByCategory = async (req, res) => {
  const category = req.params.categoryName;

  // console.log(category);

  const randomQuestions = await Question.aggregate([
    {
      $match: {
        category: { $regex: new RegExp(`^${category}$`, "i") },
      },
    },
    { $sample: { size: 10 } },
  ]);

  res.status(200).json(randomQuestions);
};

exports.postAnswers = async (req, res) => {
  try {
    const { answers, userId } = req.body;
    let correctCount = 0;
    let answersList = [];

    // معالجة كل إجابة
    for (const ans of answers) {
      const question = await Question.findById(ans.questionId);
      const isCorrect = question
        ? question.correctAnswerIndex === ans.selectedOptionIndex
        : false;

      if (isCorrect) correctCount++;

      answersList.push({
        questionId: ans.questionId,
        selectedOptionIndex: ans.selectedOptionIndex,
        isCorrect,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { score: correctCount } }, // إذا أردت زيادة متراكمة
      { new: true, runValidators: true } // new: لإرجاع المستند بعد التحديث
    ).select(' _id userName score');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // الرد للمستخدم
    res.status(200).json({
      updatedUser,
      correctCount,
      answersList,
    });
  } catch (error) {
    console.error("❌ Error checking answers:", error);
    res.status(500).json({ message: "حدث خطأ أثناء التحقق من الإجابات" });
  }
};

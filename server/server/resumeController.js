const fs = require("fs");
const pdfParse = require("pdf-parse");

const uploadResume = async (req, res) => {
  try {
    const filePath = req.file.path;

    const dataBuffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text;

    // Basic ATS Score Logic
    let atsScore = 50;

    const skills = [
      "javascript",
      "react",
      "node",
      "mongodb",
      "express",
      "python",
      "java",
      "sql",
    ];

    let matchedSkills = [];

    skills.forEach((skill) => {
      if (text.toLowerCase().includes(skill)) {
        atsScore += 5;
        matchedSkills.push(skill);
      }
    });

    res.status(200).json({
      success: true,
      extractedText: text,
      atsScore,
      matchedSkills,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Resume parsing failed",
    });
  }
};

module.exports = { uploadResume };
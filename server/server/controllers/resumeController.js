const fs = require("fs");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text || "";
    const lowerText = text.toLowerCase();

    const requiredSkills = [
      "java",
      "python",
      "javascript",
      "react",
      "node",
      "express",
      "mongodb",
      "sql",
      "html",
      "css",
      "git",
      "github",
      "api",
      "database",
      "oops",
      "dsa",
    ];

    const matchedSkills = requiredSkills.filter((skill) =>
      lowerText.includes(skill)
    );

    const missingSkills = requiredSkills.filter(
      (skill) => !lowerText.includes(skill)
    );

    const sectionChecks = {
      education: lowerText.includes("education"),
      skills: lowerText.includes("skills"),
      projects: lowerText.includes("project"),
      experience:
        lowerText.includes("experience") ||
        lowerText.includes("internship"),
      contact:
        lowerText.includes("@") ||
        lowerText.includes("linkedin") ||
        lowerText.includes("github"),
    };

    let atsScore = 0;

    atsScore += Math.round((matchedSkills.length / requiredSkills.length) * 45);

    if (sectionChecks.education) atsScore += 10;
    if (sectionChecks.skills) atsScore += 10;
    if (sectionChecks.projects) atsScore += 15;
    if (sectionChecks.experience) atsScore += 10;
    if (sectionChecks.contact) atsScore += 10;

    if (atsScore > 100) atsScore = 100;

   let aiFeedback = "Generating AI feedback...";

    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API KEY:", apiKey);

    if (apiKey && apiKey !== "your_api_key") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
        });

        const prompt = `
Analyze this resume for a fresher software developer role.

Give feedback in simple points:
1. Strengths
2. Weaknesses
3. Missing Skills
4. ATS Improvement Suggestions
5. Best Suitable Job Roles

Resume:
${text.substring(0, 6000)}
`;

        const result = await model.generateContent(prompt);
        aiFeedback = result.response.text();
      } catch (aiError) {
  console.log("FULL GEMINI ERROR:", aiError);

  aiFeedback =
    "Gemini Error: " + aiError.message;
}
    }

    res.status(200).json({
      success: true,
      atsScore,
      matchedSkills,
      missingSkills,
      sectionChecks,
      aiFeedback,
      extractedText: text.substring(0, 2500),
    });
  } catch (error) {
    console.log("Resume Analysis Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Resume analysis failed. Check backend terminal.",
    });
  }
};

module.exports = { uploadResume };
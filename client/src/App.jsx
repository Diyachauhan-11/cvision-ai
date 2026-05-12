import axios from "axios";
import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {
    if (!file) {
      alert("Please select your resume PDF");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setResult(null);

      const response = await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData
      );

      setResult(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
         <h1 className="text-5xl font-bold mb-3">CVision AI</h1>
          <p className="text-gray-400">
            AI Powered Resume Analyzer, ATS Score Checker & Skill Gap Detector
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full bg-slate-800 p-4 rounded-xl"
            />

            <button
              onClick={uploadResume}
              disabled={loading}
              className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-8 py-3 rounded-xl text-lg font-semibold transition"
            >
              {loading ? "Analyzing Resume..." : "Analyze Resume"}
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-10 grid gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h2 className="text-3xl font-bold mb-4">
                ATS Score: {result.atsScore}%
              </h2>

              <div className="w-full bg-slate-800 rounded-full h-5">
                <div
                  className="bg-blue-600 h-5 rounded-full"
                  style={{ width: `${result.atsScore}%` }}
                ></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-2xl font-bold mb-4">Matched Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {result.matchedSkills?.length > 0 ? (
                    result.matchedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-green-600 px-4 py-2 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400">No matched skills found</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-2xl font-bold mb-4">Missing Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {result.missingSkills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-red-600 px-4 py-2 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-2xl font-bold mb-4">AI Feedback</h3>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {result.aiFeedback}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-2xl font-bold mb-4">Resume Text Preview</h3>
              <p className="text-gray-400 whitespace-pre-wrap text-sm">
                {result.extractedText}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

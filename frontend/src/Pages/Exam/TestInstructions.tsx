import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/instructions.css";

export default function TestInstructions() {
  const { testId, classId } = useParams();
  const navigate = useNavigate();

  const handleStartTest = async () => {
    try {
        const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen request failed", err);
    }
      navigate(`/participant/classes/${classId}/tests/${testId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to start test.");
    }
  };

  return (
    <div className="instruction-layout">
      {/* ================= LEFT CONTENT ================= */}
      <div className="instruction-content">
        <h1>Test Instructions</h1>

        <section className="card">
          <h2>📘 General Instructions</h2>
          <ul className="PadLeft">
            <li>Read all questions carefully.</li>
            <li>Use Next/Previous for navigation.</li>
            <li>Answers are saved automatically.</li>
          </ul>
        </section>

        <section className="card">
          <h2>🎯 Question Colors</h2>
          <div className="PadLeft">
            <p>
              <span className="box green"></span> Answered Question
            </p>
            <p>
              <span className="box orange"></span> Not Answered Question
            </p>
            <p>
              <span className="box blue"></span> Current Question
            </p>
          </div>
        </section>

        <section className="card warning">
          <h2>⚠ Fullscreen Rule</h2>
          <ul className="PadLeft">
            <li>Test runs in fullscreen mode.</li>
            <li>Exiting fullscreen is a violation.</li>
          </ul>
        </section>

        <section className="card danger">
          <h2>🚨 Tab Switch Rule</h2>
          <ul className="PadLeft">
            <li>Tab switching is tracked.</li>
            <li>Multiple violations may auto-submit test.</li>
          </ul>
        </section>
      </div>

      {/* ================= RIGHT FIXED ACTION PANEL ================= */}
      <div className="instruction-action">
        <div className="action-card">
          <h3>Ready to start?</h3>
          <p>
            Make sure you are in a quiet environment before starting the test.
          </p>

          <button onClick={handleStartTest} className="start-btn">
            Start Test
          </button>

          <small>⚠ Once started, timer and monitoring will begin.</small>
        </div>
      </div>
    </div>
  );
}

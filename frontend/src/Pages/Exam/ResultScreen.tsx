import { memo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResultScreen  = () => {
    const {classId} = useParams<{ classId: string }>();
    const navigate = useNavigate();
    return (
        <div>
            <h2>Test Result</h2>
            <p>Your test has been submitted successfully! Your results will be available soon.</p>
            <button onClick={() => navigate(`/participant/classes/${classId}`)}>Back to Class</button>
        </div>
    );
};

export default memo(ResultScreen);

import { memo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResultScreen  = () => {
    const {classId} = useParams<{ classId: string }>();
    const navigate = useNavigate();
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-5">
            <section className="w-full max-w-xl rounded-xl bg-white p-8 text-center shadow-md">
                <h2 className="mb-5 text-2xl font-bold text-black">Test Result</h2>
                <p className="mb-6 rounded-lg bg-green-100 p-4 font-semibold text-black">
                    Your test has been submitted successfully! Your results will be available soon.
                </p>
                <button
                    className="rounded-md bg-gradient-to-r from-[#073A7C] via-[#1767AD] to-[#255B8E] px-5 py-2.5 font-medium text-white hover:brightness-110"
                    onClick={() => navigate(`/participant/classes/${classId}`)}
                >
                    Back to Class
                </button>
            </section>
        </div>
    );
};

export default memo(ResultScreen);

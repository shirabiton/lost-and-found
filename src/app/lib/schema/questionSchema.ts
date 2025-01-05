import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answers: { type: [String], required: true },
});

export default QuestionSchema
import axios from "axios";
import Token from "../types/NER-model/token";


// sending text to AI model and analyze the response
const analyzeTextWithModel = async (sentence: string) => {
  try {
    const response = await axios.post("/api/NER-model/start-analysis", {
      text: sentence,
    });
    const nouns: string = await response.data.embeddings[0].tokens
      .filter((token: Token) => token.morph.pos === "NOUN")
      .map((token: Token) => token.lex)
      .join(",");
    return nouns;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export default analyzeTextWithModel;


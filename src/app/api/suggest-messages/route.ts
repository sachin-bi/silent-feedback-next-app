// docs here:
// (1) https://ai.google.dev/gemini-api/docs/quickstart?lang=node       // this one used here
// (2) https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai
// TODO: watch-out the return of this route

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(request: Request) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GIMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? | | If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = await model.generateContent(prompt);

    //   console.log(result.response.text());
    //   console.log(result.response.candidates);
    //   console.log(result.response.candidates[0].content.parts[0].text);  // type error
    // console.log("-- Gemini suggestions::",
    //   result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
    //     "-- Gemini didn't return suggesstions!"
    // );

    if (!result) {
      return Response.json(
        {
          success: false,
          message: "Gemini didn't return suggesstions!",
          result,
        },
        { status: 500 }
      );
    }

    // data to be sent - manipulation
    const textSuggestions = result.response.text();

    // Step 1: Split by "||" to separate each question, then trim extra whitespace
    const questionsArray = textSuggestions.split("||").map((question) => question.trim());

    // Step 2: Convert each question into an object with a 'text' key
    const questionsObjectsArray = questionsArray.map((question) => ({
      content: question,
    }));

    return Response.json(
      {
        success: true,
        message: "Gemini suggesstions! ",
        messages: questionsObjectsArray,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("---error from ai suggest-messages route:", err);
    return Response.json(
      {
        success: false,
        message: "Err in get-messages suggestion ai/route",
      },
      { status: 500 }
    );
  }
}

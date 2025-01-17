import { ChatOpenAI } from '@langchain/openai';
import { LangChainAdapter, pipeDataStreamToResponse } from 'ai';
import { config } from "dotenv";
import path from "node:path";

config();
const envFile = path.resolve(__dirname, '../../../.env');
config({ path: envFile });
console.log(`Loading .env file: ${envFile}`);

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { prompt }: { prompt: string } = await req.json();

//   const result = streamText({
//     model: openai('gpt-4o'),
//     prompt,
//   });

//   return result.toTextStreamResponse();
// }
import cors from 'cors';
import express from 'express';
const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', (req, res) => {
    const { prompt } = req.body;
    console.log(`prompt: ${prompt}`);
    pipeDataStreamToResponse(res, {
        execute: async dataStreamWriter => {
            dataStreamWriter.writeData('initialized call');

            const model = new ChatOpenAI({
                model: process.env["MODULE"],
                temperature: 0,
            }, {
                apiKey: process.env['OPENAI_API_KEY'],
                baseURL: process.env["OPENAPI_URL"],
            });
            const stream = await model.stream(prompt);
            LangChainAdapter.mergeIntoDataStream(stream, { dataStream: dataStreamWriter });
        },
        onError: error => {
            // Error messages are masked by default for security reasons.
            // If you want to expose the error message to the client, you can do so here:
            return error instanceof Error ? error.message : String(error);
        },
    });
});


const PORT = 3808;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


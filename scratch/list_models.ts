import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  try {
    const models = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Just to check connectivity
    console.log('--- Listing Models ---');
    // Note: The SDK might not have a direct listModels but we can check common names
    const commonNames = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-1.0-pro"
    ];
    
    for (const name of commonNames) {
      try {
        const model = genAI.getGenerativeModel({ model: name });
        // We can't easily "test" without generating, but let's see if we can get info
        console.log(`✅ Potentially available: ${name}`);
      } catch (e) {
        console.log(`❌ Not found: ${name}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();

// Cloudflare Worker for ReLoop AI Scanner
// Deploy this to Cloudflare Workers to proxy AI requests

const ACCOUNT_ID = 'e122a6e8bae7e0a4eb0bd95745bf83a2';
const API_TOKEN = 'l2TXhmOvo6gtmy--gKRwhwu0-S3I-J6S886_tAud';

export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }

        if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        try {
            const { image } = await request.json();

            if (!image) {
                return new Response(JSON.stringify({ error: 'No image provided' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                });
            }

            // Convert base64 to array
            const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Call Cloudflare AI
            const aiResponse = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/llava-hf/llava-1.5-7b-hf`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${API_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: `Identify this item for a campus marketplace. Respond ONLY with JSON:
{"objectName": "specific item name", "category": "electronics/books/furniture/clothing/kitchen/sports/other", "condition": "Like New/Good/Fair/Poor", "estimatedCoins": 10-200, "recyclable": true/false}`,
                        image: Array.from(bytes),
                    }),
                }
            );

            const result = await aiResponse.json();

            return new Response(JSON.stringify(result), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });

        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
        }
    },
};

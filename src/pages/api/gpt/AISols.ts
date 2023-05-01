import fetch from 'node-fetch';

export default async function handler(
    req: { method: string; body: any },
    res: {
        status: (arg0: number) => {
            (): any;
            new (): any;
            json: { (arg0: { error: string }): void; new (): any };
            end: { (arg0: string): void; new (): any };
        };
        setHeader: (arg0: string, arg1: string) => void;
    }
) {
    // 設置CORS頭部
    res.setHeader('Access-Control-Allow-Origin', 'https://yitutor.vercel.app/');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 處理OPTIONS請求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        const API_KEY = process.env.OPENAI_API_KEY;
        const apiRequestBody = req.body;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_KEY}`,
                },
                body: JSON.stringify(apiRequestBody),
            });

            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching API:', error);
            res.status(500).json({ error: 'Error fetching API' });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}

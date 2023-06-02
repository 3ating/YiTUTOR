import fetch from 'node-fetch';

export default async function handler(
    req: { body: any },
    res: { status: (arg0: number) => { (): any; new (): any; json: { (arg0: any): void; new (): any } } }
) {
    const API_KEY = process.env.OPENAI_API_KEY;
    const apiRequestBody = req.body;

    if (typeof apiRequestBody !== 'object' || apiRequestBody === null) {
        res.status(400).json({ error: 'Invalid JSON object in the request body.' });
        return;
    }

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
}

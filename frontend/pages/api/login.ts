// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { login as loginService } from '@/services/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    try {
        const { username, password } = req.body;
        const data = await loginService(username, password);

        // Optionally, set HttpOnly cookies here for improved security.
        res.setHeader('Set-Cookie', [
            `access_token=${data.access}; Path=/; HttpOnly; SameSite=Strict`,
            `refresh_token=${data.refresh}; Path=/; HttpOnly; SameSite=Strict`
        ]);

        res.status(200).json(data);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
}

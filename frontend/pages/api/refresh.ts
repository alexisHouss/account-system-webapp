import type { NextApiRequest, NextApiResponse } from 'next';
import { refreshToken as refreshTokenService } from '@/services/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        const { refreshToken } = req.body;
        const data = await refreshTokenService(refreshToken);

        // Update the cookies if needed
        res.setHeader('Set-Cookie', [
            `access_token=${data.access}; Path=/; HttpOnly; Secure; SameSite=Strict`,
            `refresh_token=${data.refresh}; Path=/; HttpOnly; Secure; SameSite=Strict`
        ]);

        res.status(200).json(data);
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Token refresh failed' });
    }
}

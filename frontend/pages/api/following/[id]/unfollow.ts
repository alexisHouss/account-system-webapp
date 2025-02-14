// pages/api/following/[id]/unfollow.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerApiClient } from '@/services/serverApiClient';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'DELETE') {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ message: 'Missing id parameter' });
    }

    try {
        const client = await createServerApiClient(req, res);
        // Proxy the DELETE request to your external API endpoint.
        const response = await client.delete(`/users/follow/${id}/unfollow/`);
        // Return 204 (No Content) on success.
        return res.status(204).json(response.data);
    } catch (error: any) {
        console.error('Error unfollowing user:', error.response?.data || error.message);
        return res.status(500).json({ message: 'Error unfollowing user' });
    }
}

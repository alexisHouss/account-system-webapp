// pages/api/following/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerApiClient } from '@/services/serverApiClient';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        // POST: Follow a user (unchanged)
        const { following } = req.body;
        console.log('following', following);

        if (!following) {
            return res
                .status(400)
                .json({ message: "Missing 'following' in request body" });
        }

        try {
            const client = await createServerApiClient(req, res);
            // Proxy the POST request to your external API endpoint.
            const response = await client.post('/users/follow/', { following });


            return res.status(201).json(response.data);

        } catch (error: any) {
            console.error('Error following user:', error.response?.data || error.message);

            return res.status(500).json({ message: 'Error following user' });
        }

    } else if (req.method === 'GET') {
        // GET: Fetch follow data (new behavior)
        try {
            const client = await createServerApiClient(req, res);
            // Proxy the GET request to your external API endpoint.
            const response = await client.get('/users/follow/');

            return res.status(200).json(response.data);

        } catch (error: any) {
            console.error(
                'Error fetching follow data:',
                error.response?.data || error.message
            );

            return res.status(500).json({ message: 'Error fetching follow data' });
        }

    } else {
        res.setHeader('Allow', ['POST', 'GET']);

        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
}

// pages/api/search_profiles.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerApiClient } from '@/services/serverApiClient';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Get the username query parameter
    const { username } = req.query;
    if (!username || typeof username !== 'string') {
        return res
            .status(400)
            .json({ message: 'Missing or invalid username parameter' });
    }

    try {
        // Await the server-side axios client using the request (and response) object.
        const client = await createServerApiClient(req, res);
        // Fetch profiles from the external API
        const response = await client.get(
            `/users/profiles/search/?username=${encodeURIComponent(username)}`
        );
        return res.status(200).json(response.data);
    } catch (error: any) {
        console.error('Error fetching profiles:', error);
        return res.status(500).json({ message: 'Error fetching profiles' });
    }
}

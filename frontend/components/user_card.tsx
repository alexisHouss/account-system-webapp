// components/user_card.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type UserCardProps = {
    profile: {
        id: number;
        user: number;
        username: string;
        bio: string;
        first_name: string;
        last_name: string;
        number_of_followers: number;
        number_of_followees: number;
        is_following: boolean;
    };
};

const UserCard: React.FC<UserCardProps> = ({ profile }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isMe, setIsMe] = useState(false);
    const [followersCount, setFollowersCount] = useState(profile.number_of_followers);

    console.log('profile:', profile);


    useEffect(() => {
        const refreshProfile = async () => {
            try {
                if (localStorage.getItem('username') === profile.username) {
                    setIsMe(true);
                    return;
                } else {
                    setIsMe(false);
                }
                const response = await axios.get(`/api/following`);

                if (response.data.length === 0) {
                    setIsFollowing(false);
                    return;
                }

                let is_following = false;
                for (let i = 0; i < response.data.length; i++) {
                    console.log(response.data[i], 'profile.id:', profile.user);
                    if (response.data[i].following === profile.user) {
                        is_following = true;
                        break;
                    }
                }
                if (is_following) {
                    setIsFollowing(true);
                } else {
                    setIsFollowing(false);
                }
            } catch (error) {
                console.error('Error refreshing profile:', error);
            }
        };

        refreshProfile();
    }, [profile]);



    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                // Unfollow the user:
                // Assuming your endpoint for unfollow is something like:
                // DELETE /api/following/<user_id>/unfollow/
                await axios.delete(`/api/following/${profile.user}/unfollow/`);
                setIsFollowing(false);
                setFollowersCount((prev) => prev - 1);

            } else {
                // Follow the user:
                // Assuming your endpoint for follow is something like:
                // POST /api/following/ with body { following: user.id }
                await axios.post(`/api/following/`, { following: profile.user });
                setIsFollowing(true);
                setFollowersCount((prev) => prev + 1);

            }
        } catch (error) {
            console.error('Error updating follow status:', error);
        }
    };

    return (
        <div
            style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                width: '300px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                margin: '16px auto',
                fontFamily: 'Arial, sans-serif'
            }}
        >
            {/* Username at the top */}
            <h2 style={{ margin: '0 0 12px 0', textAlign: 'center' }}>
                {profile.username}
            </h2>

            {/* Bio */}
            <p style={{ margin: '4px 0', textAlign: 'center', color: '#666' }}>
                {profile.bio}
            </p>

            {/* First and Last Name */}
            <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: '4px 0' }}>
                    <strong>First Name:</strong> {profile.first_name}
                </p>
                <p style={{ margin: '4px 0' }}>
                    <strong>Last Name:</strong> {profile.last_name}
                </p>
            </div>

            {/* Followers and Following */}
            <div style={{ marginBottom: '16px' }}>
                <p style={{ margin: '4px 0' }}>
                    <strong>Followers:</strong> {followersCount}
                </p>
                <p style={{ margin: '4px 0' }}>
                    <strong>Following:</strong> {profile.number_of_followees}
                </p>
            </div>

            {/* Follow/Unfollow Button */}
            {!isMe && (

                <button
                    onClick={handleFollowToggle}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: isFollowing ? '#e74c3c' : '#2ecc71',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </button>

            )}
        </div>
    );
};

export default UserCard;

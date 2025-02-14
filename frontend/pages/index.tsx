// pages/search.tsx
import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import UserCard from '@/components/user_card';

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
}

interface Profile {
  id: number;
  user: number;
  username: string;
  bio: string;
  first_name: string;
  last_name: string;
  number_of_followers: number;
  number_of_followees: number;
  is_following: boolean;
}

const SearchPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!searchTerm) {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/search_profiles?username=${encodeURIComponent(searchTerm)}`
        );
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching profiles', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [searchTerm]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (selectedProfile === "") {
        setProfile(null);
        return
      }

      try {
        const response = await axios.get(
          `/api/user_profile?username=${encodeURIComponent(selectedProfile)}`
        );

        setProfile(response.data);

      } catch (error) {
        console.error('Error fetching profile', error);

      }
    };

    fetchProfile();

  }, [selectedProfile]);

  const handleUserClick = (username: string) => {
    setSelectedProfile(username);
  };

  return (
    <div className="grid grid-rows-[5fr_2fr_5fr] h-screen">
      {/* Top: Profile details (5/12 of height) */}
      <div className="flex items-center justify-center bg-gray-50">
        {profile ? (
          <UserCard
            profile={{
              id: profile.id,
              user: profile.user,
              bio: profile.bio,
              username: profile.username,
              first_name: profile.first_name,
              last_name: profile.last_name,
              number_of_followers: profile.number_of_followers,
              number_of_followees: profile.number_of_followees,
              is_following: profile.is_following,
            }}
          />
        ) : (
          <p className="text-gray-500">
            Click on a profile below to see details here.
          </p>
        )}
      </div>

      {/* Middle: Search bar (2/12 of height) */}
      <div className="flex flex-col items-center justify-center mt-4">
        <div className="w-2/3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by username"
            className="w-full px-6 py-3 border border-gray-300 rounded-full shadow-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>


        {/* Bottom: Search results (5/12 of height) */}
        <div className="w-2/3 mt-4">
          {loading ? (
            <p>Loading...</p>
          ) : users.length > 0 ? (
            <ul className="divide-y divide-gray-300">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="cursor-pointer py-3 hover:bg-gray-100 mt-4"
                  onClick={() => handleUserClick(user.username)}
                >
                  <p className="font-bold">{user.username}</p>
                  <p>
                    {user.first_name} {user.last_name}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>

    </div>


  );
};

SearchPage.layout = 'AuthLayout';

export default SearchPage;

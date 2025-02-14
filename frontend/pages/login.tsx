import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    import("preline");
  }, []);

  // State for toggling password visibility
  const [passwordShow, setPasswordShow] = useState(false);

  // State for error message and form data
  const [err, setError] = useState("");
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = data;

  // Update state on input change
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use the login service function instead of calling authAxios directly.
      await axios.post('/api/login', data);

      localStorage.setItem('username', data.username);

      router.push('/'); // Change this to your desired route
    } catch (error) {
      console.error('Login failed', error);

      setError('Login failed. Please check your credentials and try again.');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-bold mb-6 text-gray-900">
          Sign In
        </h2>

        {err && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded">
            {err}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={changeHandler}
              required
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 
                         rounded-md shadow-sm placeholder-gray-400 focus:outline-none 
                         focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Username"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={passwordShow ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={changeHandler}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 
                           rounded-md shadow-sm placeholder-gray-400 focus:outline-none 
                           focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setPasswordShow(!passwordShow)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer focus:outline-none"
                aria-label="Toggle password visibility"
              >
                <i
                  className={`bx ${passwordShow ? "bx-hide" : "bx-show"} text-gray-600 text-xl`}
                ></i>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent 
                         text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </button>
          </div>
        </form>

        {/* Link to Sign Up */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

Login.layout = 'AuthLayout'; // This page will use AuthLayout

export default Login;

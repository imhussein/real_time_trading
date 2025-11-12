import { useState } from "react";
import InputField from "../components/shared/InputField";
import axiosClient from "../http/axiosClient";

export default function LoginPage() {
  const [username, setUsername] = useState("root");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/";
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm p-8"
      >
        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">
          Sign in to Tickers Dashboard
        </h1>
        <p className="text-1xl font-semibold text-center text-gray-900 mb-6">
          Just Click Submit with default login values or just enter root in
          username field and 123456 in password field
        </p>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <InputField
          id="username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="root"
          required
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="123456"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-center text-xs text-gray-500 mt-5">
          Demo credentials: <strong>root</strong> / <strong>123456</strong>
        </p>
      </form>
    </div>
  );
}

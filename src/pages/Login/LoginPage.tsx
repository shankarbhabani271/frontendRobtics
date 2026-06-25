import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import logo2 from "../../assets/logo2.png";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all details.",
        icon: "error",
        confirmButtonColor: "#201064",
      });
      return;
    }

    const success = await login(email, password);
    if (success) {
      // Dynamic redirection depending on user role
      const storedUser = JSON.parse(localStorage.getItem("sakrobotix_user") || "{}");
      if (storedUser.role === "superadmin") {
        navigate("/superadmin/dashboard");
      } else if (storedUser.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="flex flex-col items-center">
          <img src={logo2} alt="SakRobotix Lab Logo" className="h-12 sm:h-16 w-auto object-contain mb-3 sm:mb-4" />
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-[#201064]">
            Welcome Back!
          </h2>
          <p className="mt-1.5 sm:mt-2 text-center text-sm text-slate-500">
            Sign in to access your orders, wishlist, and profile.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1 font-semibold">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@sakrobotix.com"
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm font-medium"
              />
            </div>
            
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1 font-semibold">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-650 font-bold select-none cursor-pointer">
                Remember me
              </label>
            </div>

            <div className="text-sm font-bold">
              <a href="#" className="text-indigo-600 hover:text-indigo-550">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#201064] hover:bg-[#321d96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition cursor-pointer uppercase tracking-wider shadow-md active:scale-98"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center text-sm font-bold text-slate-500 border-t border-slate-100 pt-6">
          New to SakRobotix?{" "}
          <Link to="/register" className="text-indigo-650 hover:text-indigo-550">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

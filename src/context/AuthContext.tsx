import React, { createContext, useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "user";
  isActive: boolean;
  purchasedCourses: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string, password?: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const API_BASE_URL = "http://localhost:8090/api";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("sakrobotix_token");
      const storedUser = localStorage.getItem("sakrobotix_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Fetch fresh profile in background to verify token & get updated purchased list
        try {
          const res = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (res.ok) {
            const freshProfile = await res.json();
            setUser(freshProfile);
            localStorage.setItem("sakrobotix_user", JSON.stringify(freshProfile));
          } else if (res.status === 401 || res.status === 403) {
            // Token expired or deactivated
            handleLogoutClean();
            if (res.status === 403) {
              Swal.fire("Session Terminated", "Your account has been deactivated.", "error");
            }
          }
        } catch (e) {
          console.error("Failed to refresh user session", e);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogoutClean = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("sakrobotix_token");
    localStorage.removeItem("sakrobotix_user");
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          title: "Login Failed",
          text: data.message || "Invalid credentials",
          icon: "error",
          confirmButtonColor: "#201064",
        });
        return false;
      }

      setToken(data.token);
      localStorage.setItem("sakrobotix_token", data.token);

      // Load profile info (data has token + basic details, let's fetch profile to populate courses)
      const profileRes = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      
      const profileData = profileRes.ok ? await profileRes.json() : data;
      setUser(profileData);
      localStorage.setItem("sakrobotix_user", JSON.stringify(profileData));

      Swal.fire({
        title: "Login Successful",
        text: `Welcome back, ${profileData.name}!`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      return true;
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Network connection error.", "error");
      return false;
    }
  };

  const register = async (name: string, email: string, password?: string): Promise<boolean> => {
    try {
      // Mock password generation for simple sign-up or hardcode for demo
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: password || "User123!" }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          title: "Registration Failed",
          text: data.message || "An error occurred",
          icon: "error",
          confirmButtonColor: "#201064",
        });
        return false;
      }

      // Automatically log in
      setToken(data.token);
      localStorage.setItem("sakrobotix_token", data.token);
      
      const profileRes = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const profileData = profileRes.ok ? await profileRes.json() : data;

      setUser(profileData);
      localStorage.setItem("sakrobotix_user", JSON.stringify(profileData));

      Swal.fire({
        title: "Account Created!",
        text: "Your registration is complete.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      return true;
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Network connection error.", "error");
      return false;
    }
  };

  const logout = () => {
    handleLogoutClean();
    Swal.fire({
      title: "Logged Out",
      text: "You have been securely signed out.",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("sakrobotix_user", JSON.stringify(data));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateProfile = async (name: string, email: string, password?: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Update Failed", data.message || "Failed to update profile", "error");
        return false;
      }

      await refreshProfile();
      Swal.fire("Profile Updated", "Your changes have been saved.", "success");
      return true;
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to contact database.", "error");
      return false;
    }
  };

  const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    
    const res = await fetch(url, { ...options, headers });
    
    if (res.status === 401 || res.status === 403) {
      handleLogoutClean();
      Swal.fire("Session Expired", "Please log in again.", "warning");
    }
    
    return res;
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

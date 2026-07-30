import { createContext, useContext } from "react";
import SHA256 from "crypto-js/sha256";
import useLocalStorage from "../hooks/useLocalStorage";
import { makeId } from "../utils/helpers";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage("wms_users", []);
  const [session, setSession] = useLocalStorage("wms_session", null);

  // --------------------------
  // Signup
  // --------------------------
  function signup({
    name,
    email,
    password,
    confirmPassword,
    rememberMe,
  }) {
    // Name validation
    if (!name.trim()) {
      return {
        ok: false,
        message: "Full name is required.",
      };
    }

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return {
        ok: false,
        message: "Please enter a valid email.",
      };
    }

    // Duplicate email
    const exists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      return {
        ok: false,
        message: "Email already exists.",
      };
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return {
        ok: false,
        message:
          "Password must contain uppercase, lowercase, number, special character and be at least 8 characters.",
      };
    }

    // Confirm password
    if (password !== confirmPassword) {
      return {
        ok: false,
        message: "Passwords do not match.",
      };
    }

    // Hash password
    const hashedPassword = SHA256(password).toString();

    const newUser = {
      id: makeId("user"),
      name,
      email,
      password: hashedPassword,
      role: "admin",
      avatar: null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
    };

    setUsers([...users, newUser]);

    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    if (rememberMe) {
      setSession(userSession);
    } else {
      sessionStorage.setItem(
        "wms_session",
        JSON.stringify(userSession)
      );
    }

    return {
      ok: true,
      message: "Account created successfully.",
    };
  }

  // --------------------------
  // Login
  // --------------------------
  function login({
    email,
    password,
    rememberMe,
  }) {
    const hashedPassword = SHA256(password).toString();

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === hashedPassword
    );

    if (!user) {
      return {
        ok: false,
        message: "Incorrect email or password.",
      };
    }

    // Update last login
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            lastLogin: new Date().toISOString(),
          }
        : u
    );

    setUsers(updatedUsers);

    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (rememberMe) {
      setSession(userSession);
    } else {
      sessionStorage.setItem(
        "wms_session",
        JSON.stringify(userSession)
      );
    }

    return {
      ok: true,
      message: `Welcome back ${user.name}!`,
    };
  }

  // --------------------------
  // Logout
  // --------------------------
  function logout() {
    setSession(null);
    sessionStorage.removeItem("wms_session");
  }

  // --------------------------
  // Current User
  // --------------------------
  const currentUser =
    session ||
    JSON.parse(sessionStorage.getItem("wms_session"));

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        users,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
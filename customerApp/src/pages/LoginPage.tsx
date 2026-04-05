import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { useAuth } from "../context";
import { Button } from "../components/ui/button";
import { Navigate } from "react-router";
import { toast } from "react-toastify";

type LoginFormState = {
  email: string;
  password: string;
};

const STORAGE_KEY = "loginFormData";

const LoginPage = () => {
  const { signedIn, handleSignIn } = useAuth();
  const [{ email, password }, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Load form data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load saved form data:", error);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newForm = { ...{ email, password }, [e.target.name]: e.target.value };
    setForm(newForm);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newForm));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!email || !password) throw new Error("Email and password are required");
      setLoading(true);
      await handleSignIn({ email, password });
      toast.success("Logged in successfully!");
    } catch (error) {
      const message = (error as { message: string }).message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (signedIn) return <Navigate to="/" />;

  return (
    <div className="h-screen w-full grid grid-cols-1 items-center justify-center">
      <div className="flex items-center justify-center">
        <div className="flex flex-col gap-5 w-100 p-5 rounded-2xl bg-background">
          <h1 className="text-2xl font-bold">DanceDesk Login</h1>
          <form
            className="mt-4 flex flex-col gap-6"
            onSubmit={handleSubmit}
            autoComplete="on"
            action="/"
          >
            <Input
              autoComplete="email"
              type="email"
              label="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
            <Input
              autoComplete="password"
              type="password"
              label="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              className="btn btn-primary self-center w-full mt-1"
              size="lg"
              disabled={loading}
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

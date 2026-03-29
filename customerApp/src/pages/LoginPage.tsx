import { useState } from "react";
import { Input } from "../components/ui/input";
import { useAuth } from "../context";
import { Button } from "../components/ui/button";
import { Navigate } from "react-router";
import { toast } from "react-toastify";

type LoginFormState = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { signedIn, handleSignIn } = useAuth();
  const [{ email, password }, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        <div className="flex flex-col gap-5 w-100 p-5 rounded-2xl bg-white">
          <h1 className="text-2xl font-bold">Login</h1>
          <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
            <Input type="text" label="email" name="email" value={email} onChange={handleChange} />
            <Input
              type="password"
              label="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
            <Button className="btn btn-primary self-center" disabled={loading}>
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

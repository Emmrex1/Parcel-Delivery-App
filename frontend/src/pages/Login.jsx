
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");


    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: form.email.trim(),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Invalid email or password."
        );
      }


      if (data?.token) {
        const storage = remember
          ? localStorage
          : sessionStorage;

        storage.setItem("token", data.token);
      }

      if (data?.accessToken) {
        const storage = remember
          ? localStorage
          : sessionStorage;

        storage.setItem("accessToken", data.accessToken);
      }

      if (data?.user) {
        const storage = remember
          ? localStorage
          : sessionStorage;

        storage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      window.dispatchEvent(new Event("authChange"));

      // Redirect after successful login
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.message ||
          "Couldn't sign you in. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">

      
        <Card className="border-border shadow-lg">

          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-display">
              Welcome back
            </CardTitle>

            <CardDescription>
              Sign in to track shipments and manage your account.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} noValidate>

            <CardContent className="space-y-4">

                  {/* ERROR MESSAGE */}         
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </div>
              )}
              
                   {/* EMAIL */}          
              <div className="space-y-2">

                <Label htmlFor="email">
                  Email
                </Label>

                <div className="relative">

                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="pl-9"
                    disabled={loading}
                    required
                  />

                </div>
              </div>

                {/* PASSWORD */}
              <div className="space-y-2">

                <div className="flex items-center justify-between">

                  <Label htmlFor="password">
                    Password
                  </Label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-accent hover:underline"
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="pl-9 pr-9"
                    disabled={loading}
                    required
                  />

                  {/* Show / Hide Password */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>
              </div>

              {/* REMEMBER ME */}
              <div className="flex items-center gap-2">

                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked) =>
                    setRemember(checked === true)
                  }
                  disabled={loading}
                />

                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </Label>

              </div>

            </CardContent>

            
            <CardFooter className="flex flex-col gap-4">

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              {/* Signup */}
              <p className="text-sm text-muted-foreground text-center">

                Don't have an account?{" "}

                <Link
                  to="/signup"
                  className="text-accent hover:underline font-medium"
                >
                  Create one
                </Link>

              </p>

            </CardFooter>

          </form>
        </Card>
      </div>
  );
};

export default Login;
;

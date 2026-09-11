
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
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

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

//  Handle input chage
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

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Please enter your full name.";
    }

    if (!form.email.trim()) {
      return "Please enter your email address.";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return "Please enter a valid email address.";
    }

    if (!form.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!form.password) {
      return "Please create a password.";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (!form.confirmPassword) {
      return "Please confirm your password.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!acceptTerms) {
      return "Please accept the terms and conditions.";
    }

    return null;
  };

  // =========================
  // HANDLE SIGNUP
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to create your account. Please try again."
        );
      }

      setSuccess(
        data?.message ||
          "Account created successfully."
      );

      // Clear form
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      setAcceptTerms(false);

      // Give user a moment to see success message
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);

      setError(
        err?.message ||
          "Something went wrong while creating your account."
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
              Create your account
            </CardTitle>

            <CardDescription>
              Join RapidXpress and manage your shipments with ease.
            </CardDescription>

          </CardHeader>

          <form onSubmit={handleSubmit} noValidate>

            <CardContent className="space-y-4">
      
      {/* Error message */}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </div>
              )}

             {/* Success message */}
              {success && (
                <div
                  role="status"
                  className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-600"
                >
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {success}
                </div>
              )}

             
              <div className="space-y-2">

                <Label htmlFor="name">
                  Full name
                </Label>

                <div className="relative">

                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    className="pl-9"
                    disabled={loading}
                    required
                  />

                </div>

              </div>

             
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

              <div className="space-y-2">

                <Label htmlFor="phone">
                  Phone number
                </Label>

                <div className="relative">

                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="08012345678"
                    value={form.phone}
                    onChange={handleChange}
                    className="pl-9"
                    disabled={loading}
                    required
                  />

                </div>

              </div>

             
              <div className="space-y-2">

                <Label htmlFor="password">
                  Password
                </Label>

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
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="pl-9 pr-9"
                    disabled={loading}
                    required
                  />

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

                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters.
                </p>

              </div>

              
              <div className="space-y-2">

                <Label htmlFor="confirmPassword">
                  Confirm password
                </Label>

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="pl-9 pr-9"
                    disabled={loading}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>

              </div>

             
              <div className="flex items-start gap-2">

                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    setAcceptTerms(checked === true)
                  }
                  disabled={loading}
                />

                <Label
                  htmlFor="terms"
                  className="text-sm font-normal leading-5 cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-accent hover:underline"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-accent hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </Label>

              </div>

            </CardContent>

            
            <CardFooter className="flex flex-col gap-4">

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="text-accent hover:underline font-medium"
                >
                  Sign in
                </Link>

              </p>

            </CardFooter>

          </form>
        </Card>
      </div>
  );
};

export default Signup;


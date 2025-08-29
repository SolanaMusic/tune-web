"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import "@solana/wallet-adapter-react-ui/styles.css";
import "@/styles/globals.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CryptoWalletLogin } from "./crypto-wallet-login";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

export function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { setUser } = useUser();

  const validateForm = () => {
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setLoginError("");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const token = response.data?.jwt;
      if (token) {
        const user = {
          name: response.data.user.userName,
          role: response.data.role,
          avatar: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${response.data.user.profile.avatarUrl}`,
          token,
        };

        setUser(user);
        router.push("/");
      } else {
        setLoginError("Invalid login response.");
      }
    } catch (error: any) {
      const serverError = error.response?.data?.error || "Login failed.";
      setLoginError(serverError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExternalLogin = (provider: string) => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    const redirectUrl = `${apiBase}auth/external-response`;
    const externalLoginUrl = `${apiBase}auth/external-login?provider=${provider}&redirectUrl=${redirectUrl}`;

    window.location.href = externalLoginUrl;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            className={cn(errors.email && "border-destructive")}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className={cn(errors.password && "border-destructive")}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>

        {loginError && (
          <p className="text-sm text-destructive text-center mt-2">
            {loginError}
          </p>
        )}
      </form>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Separator className="flex-1" />
        <span>OR CONTINUE WITH</span>
        <Separator className="flex-1" />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={() => handleExternalLogin("google")}
        >
          <Image
            src="/icons/google-logo-icon.svg"
            alt="Google"
            width={25}
            height={25}
          />
          <span className="sr-only">Google</span>
        </Button>
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={() => handleExternalLogin("facebook")}
        >
          <Image
            src="/icons/facebook-logo-icon.svg"
            alt="Facebook"
            width={25}
            height={25}
          />
          <span className="sr-only">Facebook</span>
        </Button>
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={() => handleExternalLogin("twitter")}
        >
          <Image
            src="/icons/twitter-logo-icon.svg"
            alt="Twitter"
            width={25}
            height={25}
          />
          <span className="sr-only">Twitter</span>
        </Button>

        <CryptoWalletLogin />
      </div>
    </div>
  );
}

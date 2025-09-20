"use client";

import { useState, ChangeEvent, FormEvent } from "react";
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
import { useUserStore } from "@/stores/UserStore";

export function Register() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const validateForm = () => {
    setRegisterError("");
    const newErrors = {
      userName: "",
      email: "",
      password: "",
      repeatPassword: "",
    };

    if (formData.userName && formData.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    }

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

    if (!formData.repeatPassword) {
      newErrors.repeatPassword = "Please confirm your password";
    } else if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
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
      setRegisterError("");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/register`,
        {
          email: formData.email,
          userName: formData.userName,
          password: formData.password,
          repeatPassword: formData.repeatPassword,
        }
      );

      const token = response.data?.jwt;
      if (token) {
        const user = {
          id: response.data.user.id,
          name: response.data.user.userName,
          role: response.data.role,
          avatar: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${response.data.user.profile.avatarUrl}`,
          tokensAmount: response.data.user.profile.tokensAmount,
          token,
        };

        setUser(user);
        router.push("/");
      } else {
        setRegisterError("Invalid register response.");
      }
    } catch (error: any) {
      const serverError = error.response?.data?.error || "Registration failed.";
      setRegisterError(serverError);
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
          <Label htmlFor="userName">
            Username <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="userName"
            name="userName"
            type="text"
            placeholder="Your username"
            value={formData.userName}
            onChange={handleChange}
            className={cn(errors.userName && "border-destructive")}
            disabled={isLoading}
          />
          {errors.userName && (
            <p className="text-xs text-destructive">{errors.userName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
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
          <Label htmlFor="password">
            Password <span className="text-destructive">*</span>
          </Label>
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

        <div className="space-y-2">
          <Label htmlFor="repeatPassword">
            Confirm Password <span className="text-destructive">*</span>
          </Label>
          <Input
            id="repeatPassword"
            name="repeatPassword"
            type="password"
            placeholder="••••••••"
            value={formData.repeatPassword}
            onChange={handleChange}
            className={cn(errors.repeatPassword && "border-destructive")}
            disabled={isLoading}
          />
          {errors.repeatPassword && (
            <p className="text-xs text-destructive">{errors.repeatPassword}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign Up
        </Button>

        {registerError && (
          <p className="text-sm text-destructive text-center mt-2">
            {registerError}
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

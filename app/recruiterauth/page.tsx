"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/services/authService";


type AuthMode = "login" | "register";

export default function AuthForm() {

  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [userType, setUserType] = useState<"user" | "recruiter">("recruiter");
  const [country, setCountry] = useState<"UK" | "CA" | "US" | "AU" | "Europe">("UK");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileLink: "",
    country: "",
    password: "",
    confirmPassword: "",
    companyName: "", // for recruiters only
    companyWebsite: "", // for recruiters only
    phoneNumber: "", // for recruiters only
    description: "", // for recruiters only
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        const data = await authService.register({
          ...formData,
          userType: userType,
          country: country,
        }).then(() => {
          setMode("login");
        });

      } else {
        const data = await authService.login({
          ...formData,
          userType: userType,
        }).then(() => {
          router.push('/');
        });

      }
    } catch (error) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="flex flex-col gap-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#0284DA]">
              {mode === "login" ? "Login" : "Register"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* <Select
                value={userType}
                onValueChange={(value: "user" | "recruiter") => setUserType(value)}
              >
                <SelectTrigger className="focus:outline-none focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                </SelectContent>
              </Select> */}

              {mode === "register" && (
                <Input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                />
              )}

              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
              />

              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
              />

              {mode === "register" && (
                <>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                    className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                  />
                  <Select
                    value={country}
                    onValueChange={(value: "UK" | "CA" | "US" | "AU" | "Europe") => setCountry(value)}
                  >
                    <SelectTrigger className="focus:outline-none focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0">
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="CA">CA</SelectItem>
                      <SelectItem value="US">US</SelectItem>
                      <SelectItem value="AU">AU</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    placeholder="Profile Link"
                    value={formData.profileLink}
                    onChange={(e) =>
                      setFormData({ ...formData, profileLink: e.target.value })
                    }
                    required
                    className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                  />
                  {userType === "recruiter" && (
                    <>
                      <Input
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({ ...formData, companyName: e.target.value })
                        }
                        required
                        className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                      />
                      <Input
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                        required
                        className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                      />
                      <Input
                        placeholder="Company Website"
                        value={formData.companyWebsite}
                        onChange={(e) =>
                          setFormData({ ...formData, companyWebsite: e.target.value })
                        }
                        required
                        className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                      />
                      <Input
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        required
                        className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                      />
                    </>
                  )}
                </>
              )}

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <Button type="submit" className="w-full w-full mt-2 bg-[#0284DA] hover:bg-[#0284FF] text-white" disabled={loading}>
                {loading
                  ? "Loading..."
                  : mode === "login"
                    ? "Login"
                    : "Register"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-blue-500 hover:text-blue-600"
            >
              {mode === "login"
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
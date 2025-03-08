import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/component/spinner";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      localStorage.setItem("token", "your-auth-token");
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
      <Card className="w-[350px] bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {t("welcome")}
            </h1>
            <p className="text-sm text-slate-400">
              Enter your credentials to access your account
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Login
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your login"
                className="bg-slate-800 border-slate-700 text-slate-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="bg-slate-800 border-slate-700 text-slate-200"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white`}
            >
              {isLoading ? <Spinner /> : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/component/spinner";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  FormControl,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutateData } from "@/hook/useApi";
import { toast } from "sonner";

const formSchema = z.object({
  login: z.string().min(1, { message: "login is required" }),
  password: z.string().min(1, { message: "password is required" }),
});

export default function LoginPage() {
  const { t } = useTranslation();
  const { mutate, isLoading, isError } = useMutateData();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "sunadmin",
      password: "",
    },
  });

  const submitData = (data) => {
    mutate({
      endpoint: "/verify",
      data: data,
      navigatePath: "/report",
    });
  };

  if (isError) {
    toast.error(t("LoginOrPasswordIsIncorrect"));
  }

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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitData)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Login</FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="text"
                        className="bg-slate-800 border-slate-700 text-slate-200"
                        placeholder="Login"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Password</FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="password"
                        className="bg-slate-800 border-slate-700 text-slate-200"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white`}
              >
                {isLoading ? <Spinner /> : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

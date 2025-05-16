
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AuthHeadingProps {
  title?: string;
}

const AuthHeading = ({ title = "Welcome Back" }: AuthHeadingProps) => {
  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <CardDescription>
        Enter your details to continue
      </CardDescription>
    </CardHeader>
  );
};

export default AuthHeading;

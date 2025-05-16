
import React from "react";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";

const AuthHeading = () => {
  return (
    <CardHeader className="text-center">
      <CardTitle className="text-2xl">Welcome</CardTitle>
      <CardDescription>
        Sign in to your account or create a new profile
      </CardDescription>
    </CardHeader>
  );
};

export default AuthHeading;

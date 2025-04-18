// lib/withAuth.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const withAuth = (WrappedComponent: any, allowedRoles: string[]) => {
  const WithAuthComponent = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const accessToken = Cookies.get("accessToken");
      const userData = localStorage.getItem("userData");

      if (!accessToken || !userData) {
        router.push("/teacher/sign-in");
        return;
      }

      const user = JSON.parse(userData);
      if (!allowedRoles.includes(user.userType)) {
        router.push("/unauthorized");
        return;
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
  WithAuthComponent.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;
  return WithAuthComponent;
};

export default withAuth;

// lib/withAuth.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const withAuth = (WrappedComponent: any, allowedRoles: string[]) => {
  const WithAuthComponent = (props: any) => {
    const navigate = useNavigate();

    useEffect(() => {
      const accessToken = Cookies.get("accessToken");
      const userData = localStorage.getItem("userData");

      if (!accessToken || !userData) {
        navigate("/teacher/sign-in");
        return;
      }

      const user = JSON.parse(userData);
      if (!allowedRoles.includes(user.userType)) {
        navigate("/unauthorized");
        return;
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithAuthComponent;
};

export default withAuth;

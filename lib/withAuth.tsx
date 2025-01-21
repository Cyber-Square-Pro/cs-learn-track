// lib/withAuth.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent, allowedRoles) => {
  const ComponentWithAuth = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const userDataString = sessionStorage.getItem("userData");
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (!userData || !allowedRoles.includes(userData.userType)) {
        sessionStorage.removeItem("userData");
        navigate("/");
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };

  ComponentWithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithAuth;
};

export default withAuth;
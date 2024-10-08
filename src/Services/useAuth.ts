import { useEffect, useState } from "react";
import axios, { CanceledError } from "axios";

export { CanceledError };

export const apiClient = axios.create({
  //"https://193.106.55.140:80"
  baseURL: "http://localhost:3000",
  headers: {Authorization : `Bearer ${localStorage.getItem("accessToken")}`},
});

const controller = new AbortController();



const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAndRefreshToken = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      try {
        await axios.post(
          //"https://193.106.55.140:80/auth/checkToken",
          "http://localhost:3000/auth/checkToken",
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            signal: controller.signal,
          }
        );
        setIsAuthenticated(true);
      } catch (error) {
        if (error instanceof CanceledError) {
          console.log("Fetch canceled");
        }
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          console.log("Token expired");
          if (refreshToken) {
            try {
              const response = await axios.get(
                // "https://193.106.55.140:80/auth/refresh",
                "http://localhost:3000/auth/refresh",
                {
                  headers: { Authorization: `Bearer ${refreshToken}` },
                  signal: controller.signal,
                }
              );
              if (response.status === 200) {
                console.log("Token refreshed");
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem(
                  "refreshToken",
                  response.data.refreshToken
                );
                setIsAuthenticated(true);
              } else {
                window.location.href = "/login";
              }
            } catch (err) {
              if (err instanceof CanceledError) {
                console.log("Fetch canceled");
              } else {
                window.location.href = "/login";
              }
            }
          } else {
            window.location.href = "/login";
          }
        }
      }
    } else {
      window.location.href = "/login";
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAndRefreshToken();
    return () => {controller.abort()};
  }, []);

  return {isLoading, isAuthenticated };
};

export default useAuth;

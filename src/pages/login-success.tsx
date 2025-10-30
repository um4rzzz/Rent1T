import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LoginSuccess() {
  const router = useRouter();
  useEffect(() => {
    const token = typeof router.query.token === "string" ? router.query.token : undefined;
    if (token) {
      localStorage.setItem("authToken", token);
      router.push("/");
    }
  }, [router]);
  return <p>Logging you in...</p>;
}

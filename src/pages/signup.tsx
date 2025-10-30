import React, { useState, useEffect } from "react";
import { Container, Box, Heading, Input, VStack, Text, Link } from "@chakra-ui/react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;


export default function SignUp() {
  const [user_name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Load GIS script on client only
    const scriptId = "google-gis-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.id = scriptId;
      document.body.appendChild(script);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setSubmitted(true);
    // TODO: send signup request (or replace console.log)
    console.log({ user_name, email, password });
    // router.push('/login'); // Uncomment and swap for real login URL if needed
  };

  return (
    <Container maxW="sm" py={{ base: 10, md: 20 }}>
      <Box borderRadius="2xl" boxShadow="lg" p={{ base: 6, md: 10 }} bg="surface">
        <Heading as="h1" size="2xl" mb={6} fontWeight="extrabold" textAlign="center">
          Create your <span style={{ color: "var(--amber-600)" }}>Rent1T</span> account
        </Heading>

        {/* Official Google Sign-In Button (GIS) */}
        <div
          id="g_id_onload"
          data-client_id={GOOGLE_CLIENT_ID}
          data-context="signin"
          data-ux_mode="redirect"
          data-login_uri="http://localhost:5000/api/auth/google"
          data-auto_prompt="false"
        ></div>
        <div
          className="g_id_signin"
          data-type="standard"
          data-shape="rectangular"
          data-theme="filled_blue"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
          style={{ marginBottom: 24, marginTop: 4 }}
        ></div>

        <div style={{ display: "flex", alignItems: "center", margin: "22px 0 18px 0" }}>
          <div style={{ flex: 1, borderBottom: "1px solid #e0e0e0" }} />
          <span style={{ margin: "0 16px", color: "#cacaca", fontWeight: 600, fontSize: 13 }}>or</span>
          <div style={{ flex: 1, borderBottom: "1px solid #e0e0e0" }} />
        </div>

        <form onSubmit={handleSubmit}>
          <VStack gap={5} align="stretch">
            <label htmlFor="user_name" style={{ fontWeight: 500 }}>Username</label>
            <div className="search-field__wrap">
              <Input className="search-field" id="user_name" placeholder="Your username" value={user_name} autoComplete="username" onChange={e => setUserName(e.target.value)} size="lg" />
            </div>
            <label htmlFor="email" style={{ fontWeight: 500 }}>Email</label>
            <div className="search-field__wrap">
              <Input className="search-field" id="email" type="email" autoComplete="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} size="lg" />
            </div>
            <label htmlFor="password" style={{ fontWeight: 500 }}>Password</label>
            <div className="search-field__wrap">
              <Input className="search-field" id="password" type="password" autoComplete="new-password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} size="lg" />
            </div>
            <label htmlFor="confirmPassword" style={{ fontWeight: 500 }}>Confirm Password</label>
            <div className="search-field__wrap">
              <Input className="search-field" id="confirmPassword" type="password" autoComplete="new-password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} size="lg" />
            </div>
            {error && <div style={{ color: "var(--amber-600)", fontWeight: 500 }}>{error}</div>}
            <button className="button" type="submit" style={{ width: "100%", marginTop: 4 }}>{submitted ? "Signing up..." : "Sign Up"}</button>
          </VStack>
        </form>
        <Text mt={6} textAlign="center">
          Already have an account?{" "}
          <Link href="/login" color="var(--amber-600)">Login</Link>
        </Text>
      </Box>
    </Container>
  );
}
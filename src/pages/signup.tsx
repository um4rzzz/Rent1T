import React, { useState } from "react";
import { Container, Box, Heading, Input, VStack, Text, Link } from "@chakra-ui/react";
import Button from "../components/ui/Button";

const GOOGLE_OAUTH_URL = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL || "http://localhost:5001/api/auth/google";

export default function SignUp() {
  const [user_name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleGoogleSignIn = () => {
    window.location.href = GOOGLE_OAUTH_URL;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setSubmitted(true);
    console.log({ user_name, email, password });
  };

  return (
    <Container maxW="sm" py={{ base: 10, md: 20 }}>
      <Box borderRadius="2xl" boxShadow="lg" p={{ base: 6, md: 10 }} bg="surface">
        <Heading as="h1" size="2xl" mb={6} fontWeight="extrabold" textAlign="center">
          Create your <span style={{ color: "var(--amber-600)" }}>Rent1T</span> account
        </Heading>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          style={{
            width: "100%",
            marginBottom: 24,
            marginTop: 4,
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            background: "#ffffff",
            border: "1px solid #dadce0",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: 500,
            color: "#3c4043",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

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
            <Button type="submit" size="lg" style={{ width: "100%", marginTop: 4 }} disabled={submitted}>
              {submitted ? "Signing up..." : "Sign Up"}
            </Button>
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
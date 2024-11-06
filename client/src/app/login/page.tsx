"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useLoginMutation } from "@/state/api";

export default function LoginPage({ children }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [login, { data, isLoading, error }] = useLoginMutation(); 

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     router.push("/"); // redirect ke home jika token ada
  //   }
  // }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({
        email,
        password,
      }).unwrap();
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.user.username);
      console.log("Login successful:", result);
      router.push("/");
    } catch (error: any) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
}

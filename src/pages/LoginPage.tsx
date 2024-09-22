import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface DecodedToken {
  id: number;
  name: string;
  email: string;
  exp: number;
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useContext(AuthContext)!;

  const handleLogin = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken, expiresIn } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // user의 정보를 리턴해주는 api가 존재하지 않아 jwtdecode하는 방식 사용
      const decoded = jwtDecode<DecodedToken>(accessToken);
      const user: User = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      };

      setAuth({ token: accessToken, user });
      setError(null);
      console.log("로그인 성공");
      // 리다이렉션 추가하기
    } catch (error) {
      console.error("로그인 실패:", error);
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <div>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

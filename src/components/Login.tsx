import { useState } from "react";
import axios from "axios";
import "./LoginStyles.css";
import { useNavigate } from "react-router-dom";
import { IoIosPerson } from "react-icons/io";
import { IoMdKey } from "react-icons/io";

export default function Login() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userType, setUserType] = useState<"USER" | "ADMIN">("USER"); // Estado para definir o tipo de usuário
  const navigate = useNavigate();

  const formatCPF = (value: string): string => {
    const onlyNumbers = value.replace(/\D/g, "");
    return onlyNumbers
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        cpf: cpf.replace(/\D/g, ""),
        senha: password,
      });

      const { token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "ADMIN" && userType === "ADMIN") {
        navigate("/admin"); // Direciona para página de admin
      } else if (role === "USER" || role === "ADMIN") {
        navigate("/home"); // Direciona para página de usuário comum
      } else {
        setErrorMessage("Acesso não autorizado!");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Erro ao realizar login");
    }
  };

  return (
    <div className="login-container blue-background">
      <div className="login-box">
        <div>Acompanhe seu projeto aqui</div>

        {/* Botões para alternar entre Usuário e Administrador */}
        <div className="user-type-container">
          <button
            className={`user-type-button ${userType === "USER" ? "selected" : ""}`}
            onClick={() => setUserType("USER")}
          >
            Usuário Comum
          </button>
          <button
            className={`user-type-button ${userType === "ADMIN" ? "selected" : ""}`}
            onClick={() => setUserType("ADMIN")}
          >
            Administrador
          </button>
        </div>

        <div className="input-container">
          <IoIosPerson className="input-icon" />
          <input
            type="text"
            placeholder="CPF"
            className="input-field"
            value={cpf}
            onChange={handleCpfChange}
            maxLength={14}
          />
        </div>

        <div className="input-container">
          <IoMdKey className="input-icon" />
          <input
            type="password"
            placeholder="Senha"
            className="input-field"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
          />
        </div>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {/* Alteração dinâmica da classe do botão de login */}
        <button className={`login-button ${userType === "ADMIN" ? "admin-button" : ""}`} onClick={handleLogin}>
          Entrar
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import axios from "axios"; // Importando o Axios
import "./LoginStyles.css";
import { useNavigate } from "react-router-dom";
import { IoIosPerson } from "react-icons/io";

import { IoMdKey } from "react-icons/io";

export default function Login() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Hook de navegação

  // Função para aplicar a máscara no CPF
  const formatCPF = (value: string): string => {
    const onlyNumbers = value.replace(/\D/g, ""); // Remove caracteres não numéricos
    return onlyNumbers
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  };

  // Manipulador de mudança no input de CPF
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setCpf(formatCPF(inputValue));
  };

  // Manipulador de mudança no input de senha
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // Função para lidar com o envio do login
  const handleLogin = async () => {
    setErrorMessage(""); // Limpa mensagens de erro antes de enviar

    try {
      // Faz a requisição para a API de autenticação com Axios
      const response = await axios.post("http://localhost:8080/auth/login", {
        cpf: cpf.replace(/\D/g, ""), // Remove a máscara do CPF antes de enviar
        senha: password,
      });

      // Salva o token no localStorage
      localStorage.setItem("token", response.data.token);

      navigate("/home");
    } catch (error: any) {
      // Verifica se o erro possui uma resposta do servidor
      if (error.response) {
        setErrorMessage(
          error.response.data.message || "CPF ou senha inválidos"
        );
      } else {
        setErrorMessage(error.message || "Erro ao realizar login");
      }
    }
  };

  return (
    <body>
      <div className="login-container blue-background">
        <div>Acompanhe seu projeto aqui</div>
        <div className="login-box">
          <div className="logo"></div>

          {/* Campo de CPF com ícone */}
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
          <button className="login-button" onClick={handleLogin}>
            Entrar
          </button>
        </div>
      </div>
    </body>
  );
}





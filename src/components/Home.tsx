import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css"; // Importa o CSS atualizado

export interface Processo {
  id: number;
  usuario: {
    usuario_id: number;
    nome: string;
    cpf: string;
    email: string;
  };
  data_inicio: string;
  data_final: string;
  compra: Status;
  liberacao: Status;
  transporte: Status;
  instalacao: Status;
  finalizacao: Status;
}

export enum Status {
  Pendente = "pendente",
  Concluido = "concluido",
  EmAndamento = "em_andamento",
  AguardandoAprovacao = "aguardado_aprovacao",
}

function Home() {
  const [usuario, setUsuario] = useState<{ nome: string; cpf: string } | null>(null);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsuarioEProcessos = async () => {
      if (!token) {
        setErro("Token de autenticação não encontrado.");
        return;
      }

      try {
        const userResponse = await axios.get("http://localhost:8080/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userResponse.data;
        setUsuario(userData);

        const processosResponse = await axios.get(
          `http://localhost:8080/api/processo/usuario/${userData.usuario_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProcessos(processosResponse.data as Processo[]);
      } catch (error: any) {
        console.error("Erro ao buscar dados:", error);
        setErro(error.response?.data?.message || "Erro ao carregar os dados.");
      }
    };

    fetchUsuarioEProcessos();
  }, [token]);

  if (erro) return <p className="error">{erro}</p>;

  return (
    <div className="container">
      <h2 className="header">Acompanhe seu Projeto Solar</h2>
      {!usuario ? (
        <p>Carregando dados do usuário...</p>
      ) : (
        <UsuarioInfo usuario={usuario} />
      )}
      {processos.length === 0 ? (
        <p>Carregando informações dos processos...</p>
      ) : (
        processos.map((processo) => (
          <ProcessoInfo key={processo.id} processo={processo} />
        ))
      )}
    </div>
  );
}

function UsuarioInfo({ usuario }: { usuario: { nome: string; cpf: string } }) {
  return (
    <div className="user-info">
      <p><strong>Nome:</strong> {usuario.nome}</p>
      <p><strong>CPF:</strong> {usuario.cpf}</p>
    </div>
  );
}

function ProcessoInfo({ processo }: { processo: Processo }) {
    const etapas = [
      { label: "Entrega Final", status: processo.finalizacao },
      { label: "Instalação", status: processo.instalacao },
      { label: "Autorizações", status: processo.liberacao, data: "08/01/2025 09:15" },
      { label: "Compra do equipamento", status: processo.compra, data: "06/01/2025 12:15" },
    ];
  
    const etapasConcluidas = etapas.filter((etapa) => etapa.status === Status.Concluido).length;
    const progressoAltura = (etapasConcluidas / etapas.length) * 100;
  
    const [animacaoIniciada, setAnimacaoIniciada] = useState(false);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimacaoIniciada(true);
      }, 100); // Tempo para iniciar a animação após o carregamento
      return () => clearTimeout(timer);
    }, []);
  
    const statusLabels = {
      [Status.Pendente]: "Pendente",
      [Status.Concluido]: "Concluído",
      [Status.EmAndamento]: "Em Andamento",
      [Status.AguardandoAprovacao]: "Aguardando Aprovação",
    };
  
    const statusClasses = {
      [Status.Concluido]: "status-concluido",
      [Status.Pendente]: "status-pendente",
      [Status.EmAndamento]: "status-em-andamento",
      [Status.AguardandoAprovacao]: "status-aguardando-aprovacao",
    };
  
    const circleClasses = {
      [Status.Concluido]: "circle-concluido",
      [Status.Pendente]: "circle-pendente",
      [Status.EmAndamento]: "circle-em-andamento",
      [Status.AguardandoAprovacao]: "circle-aguardando-aprovacao",
    };
  
    return (
      <div className="process-card">
        <div className="header-row">
          <span>ID do Processo: {processo.id}</span>
          <span>Início: {processo.data_inicio}</span>
        </div>
  
        <div className="vertical-progress-container">
          {/* Linha vertical de progresso */}
          <div className="progress-bar-vertical">
            <div
              className={`progress-bar-fill ${animacaoIniciada ? "animate" : ""}`}
              style={{ height: animacaoIniciada ? `${progressoAltura}%` : "0%" }}
            ></div>
          </div>
  
          {/* Círculos e informações de cada etapa */}
          <div className="timeline">
            {etapas.map((etapa, index) => (
              <div key={index} className="timeline-item">
                <div className={`timeline-circle ${circleClasses[etapa.status]}`}></div>
                <div className="content">
                  <span>{etapa.label}</span>
                  {etapa.data && <small>({etapa.data})</small>}
                  <span className={`status ${statusClasses[etapa.status]}`}>
                    {statusLabels[etapa.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  
  

export default Home;

import './Error.css';

export default function Erro() {
    return (
        <div className="erro-container">
            <h1 className="erro-title">Seu usuário não possui processo.</h1>
            <button className="erro-button" onClick={() => window.location.href = '/'}>Voltar para o login</button>
        </div>
    );
}
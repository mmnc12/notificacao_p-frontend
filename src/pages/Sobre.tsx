import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png'; // ← IMPORTE A LOGO

const Sobre: React.FC = () => {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-2 transition-colors"
          >
            <span className="text-xl">←</span> Voltar
          </button>

          {!usuario && (
            <Link
              to="/login"
              className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-2 transition-colors"
            >
              Fazer Login →
            </Link>
          )}
        </div>

        {/* TÍTULO COM LOGO */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain mr-3" />
          Sobre o Sistema
        </h1>

        <div className="border-b border-gray-200 mb-6"></div>

        {/* CONTEÚDO */}
        <div className="space-y-6">
          {/* Descrição */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Sistema de Notificação de Arboviroses
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Sistema desenvolvido para a gestão de notificações de casos suspeitos de arboviroses, 
              incluindo Dengue, Zika e Chikungunya. A plataforma permite o registro, acompanhamento 
              e análise de dados epidemiológicos, auxiliando as autoridades de saúde no combate às doenças.
            </p>
          </section>

          {/* Tecnologias */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              🚀 Tecnologias Utilizadas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <span className="font-medium text-blue-700">React</span>
                <p className="text-sm text-gray-500">18.2.0</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <span className="font-medium text-blue-700">TypeScript</span>
                <p className="text-sm text-gray-500">5.0.0</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <span className="font-medium text-blue-700">Tailwind CSS</span>
                <p className="text-sm text-gray-500">3.4.0</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <span className="font-medium text-green-700">Node.js</span>
                <p className="text-sm text-gray-500">18+</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <span className="font-medium text-green-700">Express</span>
                <p className="text-sm text-gray-500">4.18.0</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <span className="font-medium text-purple-700">MySQL</span>
                <p className="text-sm text-gray-500">8.0+</p>
              </div>
            </div>
          </section>

          {/* Funcionalidades */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              ✅ Funcionalidades
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Autenticação JWT
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Dashboard com gráficos
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> CRUD de notificações
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Gestão de localidades
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Relatórios (Excel/PDF)
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Georreferenciamento
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Filtros e buscas
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Gestão de usuários
              </li>
            </ul>
          </section>

          {/* Versão */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              📦 Versão
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-600">
                <span className="font-medium">Versão:</span> 1.0.0
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Última atualização:</span> Agosto de 2026
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Status:</span> 
                <span className="ml-2 text-green-600 font-medium">Produção</span>
              </p>
            </div>
          </section>

          {/* Desenvolvedor */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              👨‍💻 Desenvolvedor
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-600">
                <span className="font-medium">Projeto:</span> Manoel Mecias do Nascimento
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Ano:</span> 2026
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Usuário logado:</span> {usuario?.nome || 'Nenhum'}
              </p>
            </div>
          </section>

          {/* Links */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              🔗 Links
            </h2>
            <div className="flex flex-col md:flex-row gap-3">
              <a 
                href="https://github.com/mmnc12/notificacao_p-frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-center"
              >
                📂 Frontend (GitHub)
              </a>
              <a 
                href="https://github.com/mmnc12/notificacao_p-api"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-center"
              >
                📂 Backend (GitHub)
              </a>
            </div>
          </section>
        </div>

        {/* RODAPÉ */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} - Sistema de Notificação de Arboviroses
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Desenvolvido para a Secretaria Municipal de Saúde (Setor de Endemias de Pindobaçu)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
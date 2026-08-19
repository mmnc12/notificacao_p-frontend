// ============================================
// src/pages/Relatorios/index.tsx
// ============================================

import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { notificacoesApi } from '../../api/notificacoes';
import { localidadesApi, type Localidade } from '../../api/localidades';
import type { Notificacao, NotificacaoFiltros } from '../../api/notificacoes';
import { exportacaoService } from '../../services/exportacaoService';

const Relatorios = () => {
    const [dados, setDados] = useState<Notificacao[]>([]);
    const [loading, setLoading] = useState(false);
    const [localidades, setLocalidades] = useState<Localidade[]>([]);
    const [total, setTotal] = useState(0);

    const [filtros, setFiltros] = useState({
        nome: '',
        localidade_id: '',
        status: '',
        ano: '',
        dataInicio: '',
        dataFim: '',
    });

    useEffect(() => {
        const carregarLocalidades = async () => {
            try {
                const data = await localidadesApi.listar();
                setLocalidades(data);
            } catch (error) {
            }
        };
        carregarLocalidades();
    }, []);

    const buscarDados = async (filtrosPersonalizados?: NotificacaoFiltros) => {
        setLoading(true);
        try {
            const params: NotificacaoFiltros = {};

            if (filtrosPersonalizados) {
                Object.assign(params, filtrosPersonalizados);
            } else {
                if (filtros.nome) params.nome = filtros.nome;
                if (filtros.localidade_id) params.localidade_id = parseInt(filtros.localidade_id);
                if (filtros.status) params.status = filtros.status as 'ATIVO' | 'INATIVO';
                if (filtros.ano) params.ano = parseInt(filtros.ano);
                if (filtros.dataInicio) params.dataInicio = filtros.dataInicio;
                if (filtros.dataFim) params.dataFim = filtros.dataFim;
            }

            params.limit = 9999;
            params.page = 1;

            const response = await notificacoesApi.listar(params);

            // ✅ ORDENAR POR NOME DO PACIENTE (A-Z)
            const dadosOrdenados = response.dados.sort((a, b) =>
                a.nome_paciente.localeCompare(b.nome_paciente)
            );

            setDados(dadosOrdenados);
            setTotal(response.paginacao.total);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarDados();
    }, []);

    const handleFiltrar = () => {
        buscarDados();
    };

    const limparFiltros = () => {
        setFiltros({
            nome: '',
            localidade_id: '',
            status: '',
            ano: '',
            dataInicio: '',
            dataFim: '',
        });
        buscarDados({});
    };

    const exportarExcel = async () => {
        try {
            await exportacaoService.exportarExcel(dados);
        } catch (error) {
        }
    };

    const exportarPDF = () => {
        try {
            exportacaoService.exportarPDF(dados);
        } catch (error) {
        }
    };

    const exportarCSV = () => {
        try {
            exportacaoService.exportarCSV(dados);
        } catch (error) {
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                        📄 Relatórios
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Filtre e exporte os dados das notificações
                    </p>
                </div>

                {/* Filtros */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 border border-slate-200 dark:border-slate-700 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Nome do Paciente
                            </label>
                            <input
                                type="text"
                                value={filtros.nome}
                                onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })}
                                placeholder="Buscar por nome..."
                                className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Localidade
                            </label>
                            <select
                                value={filtros.localidade_id}
                                onChange={(e) => setFiltros({ ...filtros, localidade_id: e.target.value })}
                                className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                            >
                                <option value="">Todas</option>
                                {localidades.map((loc) => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.nome_localidade}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Status
                            </label>
                            <select
                                value={filtros.status}
                                onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                                className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                            >
                                <option value="">Todos</option>
                                <option value="ATIVO">Ativo</option>
                                <option value="INATIVO">Inativo</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Ano
                            </label>
                            <select
                                value={filtros.ano}
                                onChange={(e) => setFiltros({ ...filtros, ano: e.target.value })}
                                className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                            >
                                <option value="">Todos</option>
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Data Início
                            </label>
                            <input
                                type="date"
                                value={filtros.dataInicio}
                                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                                className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Data Fim
                            </label>
                            <input
                                type="date"
                                value={filtros.dataFim}
                                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                                className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <button
                            onClick={handleFiltrar}
                            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg shadow-md shadow-emerald-500/30 transition-all"
                        >
                            🔍 Filtrar
                        </button>
                        <button
                            onClick={limparFiltros}
                            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-all"
                        >
                            Limpar
                        </button>

                        <div className="flex-1"></div>

                        <button
                            onClick={exportarExcel}
                            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all"
                        >
                            📊 Excel
                        </button>
                        <button
                            onClick={exportarPDF}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all"
                        >
                            📄 PDF
                        </button>
                        <button
                            onClick={exportarCSV}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all"
                        >
                            📋 CSV
                        </button>
                    </div>
                </div>

                {/* Tabela */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                            Resultados
                        </h2>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            Total: {total} registros
                        </span>
                    </div>

                    {loading ? (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            Carregando dados...
                        </div>
                    ) : dados.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            Nenhum registro encontrado.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <th className="text-left py-2 px-3 font-semibold text-slate-600 dark:text-slate-300">#</th>
                                        <th className="text-left py-2 px-3 font-semibold text-slate-600 dark:text-slate-300">Paciente</th>
                                        <th className="text-left py-2 px-3 font-semibold text-slate-600 dark:text-slate-300">Localidade</th>
                                        <th className="text-left py-2 px-3 font-semibold text-slate-600 dark:text-slate-300">Data</th>
                                        <th className="text-left py-2 px-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dados.slice(0, 50).map((item, index) => (
                                        <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700">
                                            <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{index + 1}</td>
                                            <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{item.nome_paciente}</td>
                                            <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{item.localidade_nome || '-'}</td>
                                            <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                                                {new Date(item.dt_notificacao).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="py-2 px-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'ATIVO' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {dados.length > 50 && (
                                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                                    Mostrando 50 de {dados.length} registros
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Relatorios;
// ============================================
// src/components/ModalUsuario.tsx
// ============================================

import { useState, useEffect } from 'react';
import type { Usuario } from '../api/usuario';

interface ModalUsuarioProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (dados: { nome: string; email: string; senha?: string; tipo: string }) => Promise<void>;
    usuario?: Usuario | null;
    titulo: string;
    loading?: boolean;
}

export const ModalUsuario = ({
    isOpen,
    onClose,
    onSave,
    usuario,
    titulo,
    loading = false,
}: ModalUsuarioProps) => {
    const [form, setForm] = useState({
        nome: '',
        email: '',
        senha: '',
        tipo: 'USUARIO',
    });

    useEffect(() => {
        if (usuario) {
            setForm({
                nome: usuario.nome,
                email: usuario.email,
                senha: '',
                tipo: usuario.tipo,
            });
        } else {
            setForm({
                nome: '',
                email: '',
                senha: '',
                tipo: 'USUARIO',
            });
        }
    }, [usuario, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nome.trim() || !form.email.trim()) {
            alert('Nome e e-mail são obrigatórios.');
            return;
        }
        if (!usuario && !form.senha) {
            alert('Senha é obrigatória para novo usuário.');
            return;
        }

        // ✅ PREPARAR DADOS PARA ENVIO
        const dadosParaEnviar: any = {
            nome: form.nome,
            email: form.email,
            tipo: form.tipo,
        };

        // ✅ SÓ ENVIA SENHA SE FOI PREENCHIDA
        if (form.senha) {
            dadosParaEnviar.senha = form.senha;
        }
        await onSave(dadosParaEnviar);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                    {titulo}
                </h3>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Nome *
                            </label>
                            <input
                                type="text"
                                value={form.nome}
                                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                E-mail *
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {usuario ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
                            </label>
                            <input
                                type="password"
                                value={form.senha}
                                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                                placeholder={usuario ? 'Digite a nova senha' : 'Digite a senha'}
                                required={!usuario}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Tipo
                            </label>
                            <select
                                value={form.tipo}
                                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                            >
                                <option value="ADMIN">Administrador</option>
                                <option value="AGENTE">Agente</option>
                                <option value="USUARIO">Usuário</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-all disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-md shadow-emerald-500/30 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
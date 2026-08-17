// ============================================
// src/pages/Notificacoes/Editar.tsx
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { notificacoesApi, type NotificacaoInput } from '../../api/notificacoes';
import { localidadesApi, type Localidade } from '../../api/localidades';

const EditarNotificacao = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [localidades, setLocalidades] = useState<Localidade[]>([]);
  const [loadingLocalidades, setLoadingLocalidades] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    nome_paciente: '',
    nome_mae: '',
    localidade_id: '',
    dt_primeiros_sintomas: '',
    dt_notificacao: '',
    dt_recebimento: '',
    endereco: '',
    suspeita_dengue: false,
    suspeita_zika: false,
    suspeita_chikungunya: false,
    observacoes: '',
  });

  useEffect(() => {
    const carregarLocalidades = async () => {
      try {
        const data = await localidadesApi.listar();
        setLocalidades(data);
      } catch (error) {
        console.error('Erro ao carregar localidades:', error);
      } finally {
        setLoadingLocalidades(false);
      }
    };
    carregarLocalidades();
  }, []);

  useEffect(() => {
    const carregarNotificacao = async () => {
      if (!id) return;
      try {
        const data = await notificacoesApi.buscarPorId(parseInt(id));

        const formatarDataInput = (dataStr: string | null | undefined): string => {
          if (!dataStr) return '';
          if (dataStr === '0000-00-00') return '';
          const d = new Date(dataStr);
          if (isNaN(d.getTime())) return '';
          return d.toISOString().split('T')[0];
        };

        setForm({
          nome_paciente: data.nome_paciente,
          nome_mae: data.nome_mae,
          localidade_id: String(data.localidade_id),
          dt_primeiros_sintomas: formatarDataInput(data.dt_primeiros_sintomas),
          dt_notificacao: formatarDataInput(data.dt_notificacao),
          dt_recebimento: formatarDataInput(data.dt_recebimento),
          endereco: data.endereco || '',
          suspeita_dengue: data.suspeita_dengue,
          suspeita_zika: data.suspeita_zika,
          suspeita_chikungunya: data.suspeita_chikungunya,
          observacoes: data.observacoes || '',
        });
      } catch (error) {
        console.error('Erro ao carregar notificação:', error);
        setErro('Notificação não encontrada.');
      } finally {
        setLoading(false);
      }
    };
    carregarNotificacao();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!form.nome_paciente) {
      setErro('Nome do paciente é obrigatório.');
      return;
    }
    if (!form.nome_mae) {
      setErro('Nome da mãe é obrigatório.');
      return;
    }
    if (!form.localidade_id) {
      setErro('Localidade é obrigatória.');
      return;
    }
    if (!form.dt_primeiros_sintomas) {
      setErro('Data dos primeiros sintomas é obrigatória.');
      return;
    }
    if (!form.dt_notificacao) {
      setErro('Data da notificação é obrigatória.');
      return;
    }

    // ✅ VALIDAÇÕES DE DATAS FUTURAS
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (new Date(form.dt_primeiros_sintomas) > hoje) {
      setErro('A data dos primeiros sintomas não pode ser futura.');
      return;
    }

    if (new Date(form.dt_notificacao) > hoje) {
      setErro('A data da notificação não pode ser futura.');
      return;
    }

    if (form.dt_recebimento && new Date(form.dt_recebimento) > hoje) {
      setErro('A data de recebimento não pode ser futura.');
      return;
    }

    if (!form.suspeita_dengue && !form.suspeita_zika && !form.suspeita_chikungunya) {
      setErro('Selecione pelo menos uma suspeita.');
      return;
    }

    if (form.dt_notificacao < form.dt_primeiros_sintomas) {
      setErro('A data da notificação não pode ser anterior aos primeiros sintomas.');
      return;
    }

    setSalvando(true);

    try {
      const dadosEnviar: NotificacaoInput = {
        nome_paciente: form.nome_paciente,
        nome_mae: form.nome_mae,
        localidade_id: parseInt(form.localidade_id),
        dt_primeiros_sintomas: form.dt_primeiros_sintomas,
        dt_notificacao: form.dt_notificacao,
        dt_recebimento: form.dt_recebimento || null,
        endereco: form.endereco,
        suspeita_dengue: form.suspeita_dengue,
        suspeita_zika: form.suspeita_zika,
        suspeita_chikungunya: form.suspeita_chikungunya,
        observacoes: form.observacoes,
        resultado: 'AGUARDANDO',
      };

      await notificacoesApi.atualizar(parseInt(id!), dadosEnviar);
      navigate('/notificacoes');
    } catch (error) {
      console.error('Erro ao atualizar notificação:', error);
      setErro('Erro ao salvar notificação. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          Carregando notificação...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Editar Notificação
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Altere os dados da notificação
            </p>
          </div>
          <button
            onClick={() => navigate('/notificacoes')}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-all"
          >
            Cancelar
          </button>
        </div>

        {erro && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md mb-4">
            <p className="text-sm text-red-700 dark:text-red-400">{erro}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nome do Paciente *
              </label>
              <input
                type="text"
                name="nome_paciente"
                value={form.nome_paciente}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nome da Mãe *
              </label>
              <input
                type="text"
                name="nome_mae"
                value={form.nome_mae}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Localidade *
              </label>
              <select
                name="localidade_id"
                value={form.localidade_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                disabled={loadingLocalidades}
                required
              >
                <option value="">Selecione...</option>
                {localidades.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.nome_localidade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Endereço
              </label>
              <input
                type="text"
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Data dos 1ºs Sintomas *
              </label>
              <input
                type="date"
                name="dt_primeiros_sintomas"
                value={form.dt_primeiros_sintomas}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Data da Notificação *
              </label>
              <input
                type="date"
                name="dt_notificacao"
                value={form.dt_notificacao}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Data de Recebimento
              </label>
              <input
                type="date"
                name="dt_recebimento"
                value={form.dt_recebimento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Suspeitas (selecione pelo menos uma) *
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  name="suspeita_dengue"
                  checked={form.suspeita_dengue}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500"
                />
                Dengue
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  name="suspeita_zika"
                  checked={form.suspeita_zika}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500"
                />
                Zika
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  name="suspeita_chikungunya"
                  checked={form.suspeita_chikungunya}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500"
                />
                Chikungunya
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={form.observacoes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/notificacoes')}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-md shadow-emerald-500/30 transition-all disabled:bg-emerald-300"
            >
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditarNotificacao;
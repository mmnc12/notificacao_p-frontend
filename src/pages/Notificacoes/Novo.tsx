// ============================================
// src/pages/Notificacoes/Novo.tsx
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { notificacoesApi, type NotificacaoInput, type Resultado } from '../../api/notificacoes';
import { localidadesApi, type Localidade } from '../../api/localidades';

interface NovoNotificacaoProps {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

// ✅ FUNÇÃO PARA GERAR LINK DO GOOGLE EARTH
const gerarLinkGoogleEarth = (lat: string, lng: string): string => {
  if (!lat || !lng) return '';
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  if (isNaN(latNum) || isNaN(lngNum)) return '';
  return `https://earth.google.com/web/@${latNum},${lngNum},0a,222.51700277d,35y,0h,45t,0r`;
};

const NovoNotificacao = ({ showToast }: NovoNotificacaoProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    latitude: '',
    longitude: '',
    resultado: 'AGUARDANDO' as Resultado,
    dt_resultado: '',
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

    // Validações
    if (!form.nome_paciente) {
      showToast('❌ Nome do paciente é obrigatório.', 'error');
      return;
    }
    if (!form.nome_mae) {
      showToast('❌ Nome da mãe é obrigatório.', 'error');
      return;
    }
    if (!form.localidade_id) {
      showToast('❌ Localidade é obrigatória.', 'error');
      return;
    }
    if (!form.dt_primeiros_sintomas) {
      showToast('❌ Data dos primeiros sintomas é obrigatória.', 'error');
      return;
    }
    if (!form.dt_notificacao) {
      showToast('❌ Data da notificação é obrigatória.', 'error');
      return;
    }

    if (form.dt_notificacao < form.dt_primeiros_sintomas) {
      showToast('❌ A data da notificação não pode ser anterior aos primeiros sintomas.', 'error');
      return;
    }

    if (!form.suspeita_dengue && !form.suspeita_zika && !form.suspeita_chikungunya) {
      showToast('❌ Selecione pelo menos uma suspeita (Dengue, Zika ou Chikungunya).', 'error');
      return;
    }

    setLoading(true);

    try {
      // ✅ GERAR LINK DO GOOGLE EARTH AUTOMATICAMENTE
      const linkGoogleEarth = gerarLinkGoogleEarth(form.latitude, form.longitude);

      const dadosEnviar: NotificacaoInput = {
        nome_paciente: form.nome_paciente,
        nome_mae: form.nome_mae,
        localidade_id: parseInt(form.localidade_id),
        dt_primeiros_sintomas: form.dt_primeiros_sintomas,
        dt_notificacao: form.dt_notificacao,
        dt_recebimento: form.dt_recebimento || null,
        endereco: form.endereco,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        link_google_earth: linkGoogleEarth,  // ← GERADO AUTOMATICAMENTE
        resultado: form.resultado,
        dt_resultado: form.dt_resultado || '',
        suspeita_dengue: form.suspeita_dengue,
        suspeita_zika: form.suspeita_zika,
        suspeita_chikungunya: form.suspeita_chikungunya,
        observacoes: form.observacoes,
      };

      await notificacoesApi.criar(dadosEnviar);
      showToast('✅ Notificação criada com sucesso!', 'success');
      navigate('/notificacoes');
    } catch (error: any) {
      console.error('Erro ao criar notificação:', error);
      const mensagem = error.response?.data?.error || 'Erro ao salvar notificação. Tente novamente.';
      showToast(`❌ ${mensagem}`, 'error');
      setErro('Erro ao salvar notificação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Nova Notificação
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Preencha os dados da nova notificação
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
                placeholder="Nome completo"
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
                placeholder="Nome da mãe"
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
                placeholder="Rua, número, bairro"
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

            {/* LATITUDE */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Latitude
              </label>
              <input
                type="text"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                placeholder="-23.550520"
              />
            </div>

            {/* LONGITUDE */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Longitude
              </label>
              <input
                type="text"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                placeholder="-46.633308"
              />
            </div>

            {/* RESULTADO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Resultado
              </label>
              <select
                name="resultado"
                value={form.resultado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
              >
                <option value="AGUARDANDO">Aguardando</option>
                <option value="POSITIVO">Positivo</option>
                <option value="NEGATIVO">Negativo</option>
                <option value="INCONCLUSIVO">Inconclusivo</option>
              </select>
            </div>

            {/* DATA DO RESULTADO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Data do Resultado
              </label>
              <input
                type="date"
                name="dt_resultado"
                value={form.dt_resultado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Suspeitas */}
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

          {/* Observações */}
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
              placeholder="Informações adicionais..."
            />
          </div>

          {/* Botões */}
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
              disabled={loading}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-md shadow-emerald-500/30 transition-all disabled:bg-emerald-300"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NovoNotificacao;
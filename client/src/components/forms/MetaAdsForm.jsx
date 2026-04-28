import { useState } from 'react';
import toast from 'react-hot-toast';
import PageCard from '../common/PageCard';
import api from '../../api/axios';

const initialForm = {
  campaignName: '',
  date: '',
  spend: '',
  cpp: '',
  cpl: '',
  results: '',
  roas: '',
  roi: '',
  notes: ''
};

const MetaAdsForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!form.campaignName.trim()) {
      toast.error('Campaign name is required');
      return false;
    }

    if (!form.date) {
      toast.error('Date is required');
      return false;
    }

    if (Number(form.spend) < 0) {
      toast.error('Spend cannot be negative');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    if (!validateForm()) return;

    try {
      setLoading(true);

      await api.post('/meta-ads', {
        campaignName: form.campaignName.trim(),
        date: form.date,
        spend: Number(form.spend || 0),
        cpp: Number(form.cpp || 0),
        cpl: Number(form.cpl || 0),
        results: Number(form.results || 0),
        roas: Number(form.roas || 0),
        roi: Number(form.roi || 0),
        notes: form.notes.trim()
      });

      toast.success('Meta Ads entry added');
      setForm(initialForm);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('META CREATE ERROR:', error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Failed to add Meta data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageCard>
      <h2 className="text-xl font-bold text-slate-900">Add Meta Ads Data</h2>
      <p className="mt-1 text-sm text-slate-500">
        Campaign spend, CPP, CPL, results, ROAS aur ROI add karo.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <input name="campaignName" value={form.campaignName} onChange={handleChange} placeholder="Campaign name" className="form-input" />
        <input name="date" type="date" value={form.date} onChange={handleChange} className="form-input" />

        <input name="spend" type="number" min="0" value={form.spend} onChange={handleChange} placeholder="Spend" className="form-input" />
        <input name="results" type="number" min="0" value={form.results} onChange={handleChange} placeholder="Results" className="form-input" />

        <input name="cpp" type="number" min="0" step="0.01" value={form.cpp} onChange={handleChange} placeholder="CPP" className="form-input" />
        <input name="cpl" type="number" min="0" step="0.01" value={form.cpl} onChange={handleChange} placeholder="CPL" className="form-input" />

        <input name="roas" type="number" min="0" step="0.01" value={form.roas} onChange={handleChange} placeholder="ROAS" className="form-input" />
        <input name="roi" type="number" min="0" step="0.01" value={form.roi} onChange={handleChange} placeholder="ROI" className="form-input" />

        <textarea name="notes" value={form.notes} onChange={handleChange} rows="4" placeholder="Notes" className="form-input md:col-span-2" />

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-indigo-700 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-800 disabled:opacity-70 md:col-span-2"
        >
          {loading ? 'Saving...' : 'Save Meta Data'}
        </button>
      </form>
    </PageCard>
  );
};

export default MetaAdsForm;
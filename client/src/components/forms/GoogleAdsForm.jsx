import { useState } from 'react';
import toast from 'react-hot-toast';
import PageCard from '../common/PageCard';
import api from '../../api/axios';

const initialForm = {
  campaignName: '',
  date: '',
  spend: '',
  conversions: '',
  ctr: '',
  costPerConversion: '',
  impressions: '',
  clicks: '',
  notes: ''
};

const GoogleAdsForm = ({ onSuccess }) => {
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

      await api.post('/google-ads', {
        campaignName: form.campaignName.trim(),
        date: form.date,
        spend: Number(form.spend || 0),
        conversions: Number(form.conversions || 0),
        ctr: Number(form.ctr || 0),
        costPerConversion: Number(form.costPerConversion || 0),
        impressions: Number(form.impressions || 0),
        clicks: Number(form.clicks || 0),
        notes: form.notes.trim()
      });

      toast.success('Google Ads entry added');
      setForm(initialForm);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('GOOGLE CREATE ERROR:', error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Failed to add Google data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageCard>
      <h2 className="text-xl font-bold text-slate-900">Add Google Ads Data</h2>
      <p className="mt-1 text-sm text-slate-500">
        Spend, conversions, CTR, clicks, impressions aur cost per conversion add karo.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <input name="campaignName" value={form.campaignName} onChange={handleChange} placeholder="Campaign name" className="form-input" />
        <input name="date" type="date" value={form.date} onChange={handleChange} className="form-input" />

        <input name="spend" type="number" min="0" value={form.spend} onChange={handleChange} placeholder="Spend" className="form-input" />
        <input name="conversions" type="number" min="0" value={form.conversions} onChange={handleChange} placeholder="Conversions" className="form-input" />

        <input name="ctr" type="number" min="0" step="0.01" value={form.ctr} onChange={handleChange} placeholder="CTR %" className="form-input" />
        <input name="costPerConversion" type="number" min="0" step="0.01" value={form.costPerConversion} onChange={handleChange} placeholder="Cost Per Conversion" className="form-input" />

        <input name="impressions" type="number" min="0" value={form.impressions} onChange={handleChange} placeholder="Impressions" className="form-input" />
        <input name="clicks" type="number" min="0" value={form.clicks} onChange={handleChange} placeholder="Clicks" className="form-input" />

        <textarea name="notes" value={form.notes} onChange={handleChange} rows="4" placeholder="Notes" className="form-input md:col-span-2" />

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-indigo-700 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-800 disabled:opacity-70 md:col-span-2"
        >
          {loading ? 'Saving...' : 'Save Google Data'}
        </button>
      </form>
    </PageCard>
  );
};

export default GoogleAdsForm;
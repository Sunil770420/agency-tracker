import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Layout from '../../components/common/Layout';
import Header from '../../components/common/Header';
import PageCard from '../../components/common/PageCard';
import EmptyState from '../../components/common/EmptyState';
import GoogleAdsForm from '../../components/forms/GoogleAdsForm';
import api from '../../api/axios';

const emptyForm = {
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

const GoogleAdsPage = () => {
  const [entries, setEntries] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/google-ads');
      setEntries(data || []);
    } catch (error) {
      console.error('GOOGLE FETCH ERROR:', error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Failed to load Google Ads data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const startEdit = (item) => {
    setEditId(item._id);
    setEditForm({
      campaignName: item.campaignName || '',
      date: item.date ? item.date.slice(0, 10) : '',
      spend: item.spend ?? '',
      conversions: item.conversions ?? '',
      ctr: item.ctr ?? '',
      costPerConversion: item.costPerConversion ?? '',
      impressions: item.impressions ?? '',
      clicks: item.clicks ?? '',
      notes: item.notes || ''
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm(emptyForm);
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateEditForm = () => {
    if (!editForm.campaignName.trim()) {
      toast.error('Campaign name is required');
      return false;
    }

    if (!editForm.date) {
      toast.error('Date is required');
      return false;
    }

    if (Number(editForm.spend) < 0) {
      toast.error('Spend cannot be negative');
      return false;
    }

    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (editLoading) return;
    if (!validateEditForm()) return;

    try {
      setEditLoading(true);

      await api.put(`/google-ads/${editId}`, {
        campaignName: editForm.campaignName.trim(),
        date: editForm.date,
        spend: Number(editForm.spend || 0),
        conversions: Number(editForm.conversions || 0),
        ctr: Number(editForm.ctr || 0),
        costPerConversion: Number(editForm.costPerConversion || 0),
        impressions: Number(editForm.impressions || 0),
        clicks: Number(editForm.clicks || 0),
        notes: editForm.notes.trim()
      });

      toast.success('Google entry updated successfully');
      cancelEdit();
      fetchEntries();
    } catch (error) {
      console.error('GOOGLE UPDATE ERROR:', error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this Google Ads entry?');
    if (!ok) return;

    try {
      setDeleteId(id);
      await api.delete(`/google-ads/${id}`);
      toast.success('Google entry deleted successfully');
      fetchEntries();
    } catch (error) {
      console.error('GOOGLE DELETE ERROR:', error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 no-page-x-scroll">
        <Header
          title="Google Ads"
          subtitle="Track Google campaign spend, conversions, CTR, impressions, clicks and cost per conversion."
        />

        <GoogleAdsForm onSuccess={fetchEntries} />

        {editId && (
          <PageCard>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Google Ads Entry
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update Google campaign performance details.
                </p>
              </div>

              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleUpdate} className="grid gap-4 md:grid-cols-2">
              <input
                name="campaignName"
                value={editForm.campaignName}
                onChange={handleEditChange}
                placeholder="Campaign name"
                className="form-input"
              />

              <input
                name="date"
                type="date"
                value={editForm.date}
                onChange={handleEditChange}
                className="form-input"
              />

              <input
                name="spend"
                type="number"
                min="0"
                value={editForm.spend}
                onChange={handleEditChange}
                placeholder="Spend"
                className="form-input"
              />

              <input
                name="conversions"
                type="number"
                min="0"
                value={editForm.conversions}
                onChange={handleEditChange}
                placeholder="Conversions"
                className="form-input"
              />

              <input
                name="ctr"
                type="number"
                min="0"
                step="0.01"
                value={editForm.ctr}
                onChange={handleEditChange}
                placeholder="CTR"
                className="form-input"
              />

              <input
                name="costPerConversion"
                type="number"
                min="0"
                step="0.01"
                value={editForm.costPerConversion}
                onChange={handleEditChange}
                placeholder="Cost Per Conversion"
                className="form-input"
              />

              <input
                name="impressions"
                type="number"
                min="0"
                value={editForm.impressions}
                onChange={handleEditChange}
                placeholder="Impressions"
                className="form-input"
              />

              <input
                name="clicks"
                type="number"
                min="0"
                value={editForm.clicks}
                onChange={handleEditChange}
                placeholder="Clicks"
                className="form-input"
              />

              <textarea
                name="notes"
                value={editForm.notes}
                onChange={handleEditChange}
                rows="4"
                placeholder="Notes"
                className="form-input md:col-span-2"
              />

              <button
                type="submit"
                disabled={editLoading}
                className="rounded-2xl bg-indigo-700 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-indigo-800 disabled:opacity-70 md:col-span-2"
              >
                {editLoading ? 'Updating...' : 'Update Entry'}
              </button>
            </form>
          </PageCard>
        )}

        <PageCard>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Google Ads List
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Recently added Google campaign entries.
              </p>
            </div>

            <button
              onClick={fetchEntries}
              className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-slate-50 p-6 text-slate-600">
              Loading Google Ads data...
            </div>
          ) : entries.length > 0 ? (
            <div className="responsive-table">
              <table className="sticky-table min-w-[1100px] text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600">
                    <th className="px-4 py-3">Campaign</th>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Spend</th>
                    <th className="px-4 py-3">Conversions</th>
                    <th className="px-4 py-3">CTR</th>
                    <th className="px-4 py-3">Cost/Conv</th>
                    <th className="px-4 py-3">Impressions</th>
                    <th className="px-4 py-3">Clicks</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {entries.map((item) => (
                    <tr key={item._id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {item.campaignName}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {item.employee?.name || '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3">₹ {item.spend || 0}</td>
                      <td className="px-4 py-3">{item.conversions || 0}</td>
                      <td className="px-4 py-3">{item.ctr || 0}%</td>
                      <td className="px-4 py-3">₹ {item.costPerConversion || 0}</td>
                      <td className="px-4 py-3">{item.impressions || 0}</td>
                      <td className="px-4 py-3">{item.clicks || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={deleteId === item._id}
                            className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-70"
                          >
                            {deleteId === item._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No Google Ads data found"
              message="Google Ads form se campaign data add karo."
            />
          )}
        </PageCard>
      </div>
    </Layout>
  );
};

export default GoogleAdsPage;
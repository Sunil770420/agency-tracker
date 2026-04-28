import MetaAdEntry from '../models/MetaAdEntry.js';
import GoogleAdEntry from '../models/GoogleAdEntry.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const getDateRange = (period, baseDate = new Date()) => {
  const now = new Date(baseDate);
  const end = endOfDay(now);
  let start = startOfDay(now);

  if (period === 'weekly') {
    start = new Date(now);
    start.setDate(now.getDate() - 6);
    start = startOfDay(start);
  } else if (period === 'monthly') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    start = startOfDay(start);
  } else if (period === 'quarterly') {
    const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
    start = new Date(now.getFullYear(), quarterStartMonth, 1);
    start = startOfDay(start);
  }

  return { start, end };
};

const getPreviousDateRange = (period, currentStart) => {
  const start = new Date(currentStart);
  const end = new Date(currentStart);
  end.setMilliseconds(-1);

  if (period === 'daily') {
    start.setDate(start.getDate() - 1);
  } else if (period === 'weekly') {
    start.setDate(start.getDate() - 7);
  } else if (period === 'monthly') {
    start.setMonth(start.getMonth() - 1);
  } else if (period === 'quarterly') {
    start.setMonth(start.getMonth() - 3);
  }

  return {
    start: startOfDay(start),
    end: endOfDay(end)
  };
};

const calculateTrend = (current, previous) => {
  if (!previous && current > 0) {
    return { direction: 'up', percentage: 100 };
  }

  if (!previous && current === 0) {
    return { direction: 'neutral', percentage: 0 };
  }

  const diff = current - previous;
  const percentage = Math.abs(((diff / previous) * 100).toFixed(2));

  return {
    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
    percentage: Number(percentage)
  };
};

const buildDateLabels = (period, start, end) => {
  const labels = [];
  const current = new Date(start);

  while (current <= end) {
    if (period === 'quarterly') {
      labels.push(
        `${current.toLocaleString('default', { month: 'short' })} ${current.getFullYear()}`
      );
      current.setMonth(current.getMonth() + 1);
    } else {
      labels.push(current.toLocaleDateString());
      current.setDate(current.getDate() + 1);
    }
  }

  return labels;
};

const sumMetaSpend = (rows) => rows.reduce((sum, item) => sum + Number(item.spend || 0), 0);
const sumMetaResults = (rows) => rows.reduce((sum, item) => sum + Number(item.results || 0), 0);
const sumGoogleSpend = (rows) => rows.reduce((sum, item) => sum + Number(item.spend || 0), 0);
const sumGoogleConversions = (rows) =>
  rows.reduce((sum, item) => sum + Number(item.conversions || 0), 0);
const sumClicks = (rows) => rows.reduce((sum, item) => sum + Number(item.clicks || 0), 0);
const sumImpressions = (rows) =>
  rows.reduce((sum, item) => sum + Number(item.impressions || 0), 0);

const average = (rows, key) => {
  if (!rows.length) return 0;
  return Number(
    (rows.reduce((sum, item) => sum + Number(item[key] || 0), 0) / rows.length).toFixed(2)
  );
};

const getScopedFilters = (req, extra = {}) => {
  const employeeId = req.query.employeeId;

  if (req.user.role === 'admin') {
    if (employeeId) {
      return { ...extra, employee: employeeId };
    }
    return { ...extra };
  }

  return { ...extra, employee: req.user._id };
};

const getScopedProjectFilter = (req) => {
  const employeeId = req.query.employeeId;

  if (req.user.role === 'admin') {
    if (employeeId) {
      return { assignedEmployees: employeeId };
    }
    return {};
  }

  return { assignedEmployees: req.user._id };
};

const getRequestedRange = (req, period) => {
  const { startDate, endDate } = req.query;

  if (startDate && endDate) {
    return {
      start: startOfDay(new Date(startDate)),
      end: endOfDay(new Date(endDate)),
      custom: true
    };
  }

  const range = getDateRange(period);
  return { ...range, custom: false };
};

const buildEmployeeLeaderboard = (metaEntries, googleEntries) => {
  const leaderboardMap = new Map();

  metaEntries.forEach((item) => {
    const empId = item.employee?._id?.toString();
    if (!empId) return;

    if (!leaderboardMap.has(empId)) {
      leaderboardMap.set(empId, {
        employeeId: empId,
        name: item.employee?.name || 'Unknown',
        team: item.employee?.team || '-',
        metaSpend: 0,
        metaResults: 0,
        googleSpend: 0,
        conversions: 0,
        score: 0
      });
    }

    const row = leaderboardMap.get(empId);
    row.metaSpend += Number(item.spend || 0);
    row.metaResults += Number(item.results || 0);
  });

  googleEntries.forEach((item) => {
    const empId = item.employee?._id?.toString();
    if (!empId) return;

    if (!leaderboardMap.has(empId)) {
      leaderboardMap.set(empId, {
        employeeId: empId,
        name: item.employee?.name || 'Unknown',
        team: item.employee?.team || '-',
        metaSpend: 0,
        metaResults: 0,
        googleSpend: 0,
        conversions: 0,
        score: 0
      });
    }

    const row = leaderboardMap.get(empId);
    row.googleSpend += Number(item.spend || 0);
    row.conversions += Number(item.conversions || 0);
  });

  const rows = Array.from(leaderboardMap.values()).map((row) => {
    const score = row.metaResults + row.conversions;
    return {
      ...row,
      score
    };
  });

  rows.sort((a, b) => b.score - a.score);
  return rows;
};

const buildTopMetaCampaign = (metaEntries) => {
  const campaignMap = new Map();

  metaEntries.forEach((item) => {
    const key = item.campaignName || 'Untitled Campaign';
    if (!campaignMap.has(key)) {
      campaignMap.set(key, {
        campaignName: key,
        spend: 0,
        results: 0,
        roasTotal: 0,
        count: 0
      });
    }

    const row = campaignMap.get(key);
    row.spend += Number(item.spend || 0);
    row.results += Number(item.results || 0);
    row.roasTotal += Number(item.roas || 0);
    row.count += 1;
  });

  const rows = Array.from(campaignMap.values()).map((row) => ({
    campaignName: row.campaignName,
    spend: row.spend,
    results: row.results,
    avgRoas: row.count ? Number((row.roasTotal / row.count).toFixed(2)) : 0
  }));

  rows.sort((a, b) => b.results - a.results);
  return rows;
};

const buildTopGoogleCampaign = (googleEntries) => {
  const campaignMap = new Map();

  googleEntries.forEach((item) => {
    const key = item.campaignName || 'Untitled Campaign';
    if (!campaignMap.has(key)) {
      campaignMap.set(key, {
        campaignName: key,
        spend: 0,
        conversions: 0,
        ctrTotal: 0,
        count: 0
      });
    }

    const row = campaignMap.get(key);
    row.spend += Number(item.spend || 0);
    row.conversions += Number(item.conversions || 0);
    row.ctrTotal += Number(item.ctr || 0);
    row.count += 1;
  });

  const rows = Array.from(campaignMap.values()).map((row) => ({
    campaignName: row.campaignName,
    spend: row.spend,
    conversions: row.conversions,
    avgCtr: row.count ? Number((row.ctrTotal / row.count).toFixed(2)) : 0
  }));

  rows.sort((a, b) => b.conversions - a.conversions);
  return rows;
};

export const getDashboardStats = async (req, res) => {
  try {
    const period = req.query.period || 'monthly';
    const { start, end } = getRequestedRange(req, period);
    const prevRange = getPreviousDateRange(period, start);

    const currentMetaFilter = getScopedFilters(req, { date: { $gte: start, $lte: end } });
    const currentGoogleFilter = getScopedFilters(req, { date: { $gte: start, $lte: end } });
    const previousMetaFilter = getScopedFilters(req, {
      date: { $gte: prevRange.start, $lte: prevRange.end }
    });
    const previousGoogleFilter = getScopedFilters(req, {
      date: { $gte: prevRange.start, $lte: prevRange.end }
    });
    const projectFilter = getScopedProjectFilter(req);

    const [
      currentMetaEntries,
      currentGoogleEntries,
      previousMetaEntries,
      previousGoogleEntries,
      projects
    ] = await Promise.all([
      MetaAdEntry.find(currentMetaFilter).populate('employee', 'name team'),
      GoogleAdEntry.find(currentGoogleFilter).populate('employee', 'name team'),
      MetaAdEntry.find(previousMetaFilter),
      GoogleAdEntry.find(previousGoogleFilter),
      Project.find(projectFilter)
    ]);

    const totalMetaSpend = sumMetaSpend(currentMetaEntries);
    const totalGoogleSpend = sumGoogleSpend(currentGoogleEntries);
    const totalConversions = sumGoogleConversions(currentGoogleEntries);
    const totalMetaResults = sumMetaResults(currentMetaEntries);
    const completedProjects = projects.filter((p) => p.status === 'completed').length;

    const prevMetaSpend = sumMetaSpend(previousMetaEntries);
    const prevGoogleSpend = sumGoogleSpend(previousGoogleEntries);
    const prevConversions = sumGoogleConversions(previousGoogleEntries);
    const prevMetaResults = sumMetaResults(previousMetaEntries);

    const totalSpend = totalMetaSpend + totalGoogleSpend;
    const prevTotalSpend = prevMetaSpend + prevGoogleSpend;

    const avgCTR = average(currentGoogleEntries, 'ctr');
    const avgROAS = average(currentMetaEntries, 'roas');
    const avgROI = average(currentMetaEntries, 'roi');
    const avgCostPerConversion = average(currentGoogleEntries, 'costPerConversion');
    const totalClicks = sumClicks(currentGoogleEntries);
    const totalImpressions = sumImpressions(currentGoogleEntries);
    const avgCPL = average(currentMetaEntries, 'cpl');
    const avgCPP = average(currentMetaEntries, 'cpp');

    const leaderboard = buildEmployeeLeaderboard(currentMetaEntries, currentGoogleEntries);
    const metaCampaigns = buildTopMetaCampaign(currentMetaEntries);
    const googleCampaigns = buildTopGoogleCampaign(currentGoogleEntries);

    res.json({
      period,
      totalMetaSpend,
      totalGoogleSpend,
      totalConversions,
      totalMetaResults,
      totalProjects: projects.length,
      completedProjects,
      avgCTR,
      avgROAS,
      avgROI,
      avgCostPerConversion,
      totalClicks,
      totalImpressions,
      avgCPL,
      avgCPP,
      trends: {
        metaSpend: calculateTrend(totalMetaSpend, prevMetaSpend),
        googleSpend: calculateTrend(totalGoogleSpend, prevGoogleSpend),
        conversions: calculateTrend(totalConversions, prevConversions),
        metaResults: calculateTrend(totalMetaResults, prevMetaResults),
        totalSpend: calculateTrend(totalSpend, prevTotalSpend)
      },
      topPerformer: leaderboard[0] || null,
      lowPerformer: leaderboard.length ? leaderboard[leaderboard.length - 1] : null,
      topMetaCampaign: metaCampaigns[0] || null,
      topGoogleCampaign: googleCampaigns[0] || null,
      leaderboard: leaderboard.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDetailedReport = async (req, res) => {
  try {
    const period = req.query.period || 'daily';
    const { start, end, custom } = getRequestedRange(req, period);

    const metaFilter = getScopedFilters(req, { date: { $gte: start, $lte: end } });
    const googleFilter = getScopedFilters(req, { date: { $gte: start, $lte: end } });
    const projectFilter = getScopedProjectFilter(req);

    const [metaEntries, googleEntries, projects] = await Promise.all([
      MetaAdEntry.find(metaFilter).populate('employee', 'name email team').sort({ date: 1 }),
      GoogleAdEntry.find(googleFilter).populate('employee', 'name email team').sort({ date: 1 }),
      Project.find(projectFilter).populate('assignedEmployees', 'name email team designation')
    ]);

    const totalMetaSpend = sumMetaSpend(metaEntries);
    const totalMetaResults = sumMetaResults(metaEntries);
    const totalGoogleSpend = sumGoogleSpend(googleEntries);
    const totalConversions = sumGoogleConversions(googleEntries);

    const projectSummary = {
      total: projects.length,
      pending: projects.filter((p) => p.status === 'pending').length,
      inProgress: projects.filter((p) => p.status === 'in-progress').length,
      completed: projects.filter((p) => p.status === 'completed').length,
      hold: projects.filter((p) => p.status === 'hold').length
    };

    const labels = buildDateLabels(custom ? 'custom' : period, start, end);

    const metaByLabel = labels.map((label) => {
      return metaEntries
        .filter((entry) => {
          const entryDate = new Date(entry.date);
          if (!custom && period === 'quarterly') {
            const monthLabel = `${entryDate.toLocaleString('default', {
              month: 'short'
            })} ${entryDate.getFullYear()}`;
            return monthLabel === label;
          }
          return entryDate.toLocaleDateString() === label;
        })
        .reduce((sum, item) => sum + Number(item.spend || 0), 0);
    });

    const googleByLabel = labels.map((label) => {
      return googleEntries
        .filter((entry) => {
          const entryDate = new Date(entry.date);
          if (!custom && period === 'quarterly') {
            const monthLabel = `${entryDate.toLocaleString('default', {
              month: 'short'
            })} ${entryDate.getFullYear()}`;
            return monthLabel === label;
          }
          return entryDate.toLocaleDateString() === label;
        })
        .reduce((sum, item) => sum + Number(item.spend || 0), 0);
    });

    const conversionByLabel = labels.map((label) => {
      return googleEntries
        .filter((entry) => {
          const entryDate = new Date(entry.date);
          if (!custom && period === 'quarterly') {
            const monthLabel = `${entryDate.toLocaleString('default', {
              month: 'short'
            })} ${entryDate.getFullYear()}`;
            return monthLabel === label;
          }
          return entryDate.toLocaleDateString() === label;
        })
        .reduce((sum, item) => sum + Number(item.conversions || 0), 0);
    });

    const allVisibleUsers =
      req.user.role === 'admin'
        ? await User.find().select('name email role team designation').sort({ name: 1 })
        : [];

    const leaderboard = buildEmployeeLeaderboard(metaEntries, googleEntries);
    const metaCampaigns = buildTopMetaCampaign(metaEntries);
    const googleCampaigns = buildTopGoogleCampaign(googleEntries);

    res.json({
      period: custom ? 'custom' : period,
      range: { start, end },
      summary: {
        totalMetaSpend,
        totalMetaResults,
        totalGoogleSpend,
        totalConversions,
        totalClicks: sumClicks(googleEntries),
        totalImpressions: sumImpressions(googleEntries),
        avgCTR: average(googleEntries, 'ctr'),
        avgROAS: average(metaEntries, 'roas'),
        avgROI: average(metaEntries, 'roi'),
        avgCPL: average(metaEntries, 'cpl'),
        avgCPP: average(metaEntries, 'cpp'),
        avgCostPerConversion: average(googleEntries, 'costPerConversion'),
        projectSummary
      },
      charts: {
        labels,
        metaSpend: metaByLabel,
        googleSpend: googleByLabel,
        conversions: conversionByLabel
      },
      metaEntries,
      googleEntries,
      projects,
      employees: allVisibleUsers,
      insights: {
        topPerformer: leaderboard[0] || null,
        lowPerformer: leaderboard.length ? leaderboard[leaderboard.length - 1] : null,
        topMetaCampaign: metaCampaigns[0] || null,
        topGoogleCampaign: googleCampaigns[0] || null,
        leaderboard: leaderboard.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
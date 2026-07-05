const Product = require("../models/Product");
const Campaign = require("../models/Campaign");

// @route GET /api/dashboard/summary
// Returns headline KPI numbers for the top cards
const getSummary = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const [totals] = await Product.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenue" },
          totalSales: { $sum: "$sales" },
          productCount: { $sum: 1 },
        },
      },
    ]);

    const activeCampaigns = await Campaign.countDocuments({ owner: ownerId, status: "active" });

    const totalRevenue = totals?.totalRevenue || 0;
    const totalSales = totals?.totalSales || 0;

    // Simple, transparent placeholder metrics until a real Orders/Visitors
    // collection is wired in. Swap these for real aggregations once you
    // add traffic tracking / an Order model.
    const visitors = Math.max(totalSales * 18, 120);
    const conversionRate = visitors ? Number(((totalSales / visitors) * 100).toFixed(2)) : 0;
    const roi = totalRevenue ? Number((totalRevenue / (totalRevenue * 0.35 || 1)).toFixed(2)) : 0;

    res.json({
      revenue: totalRevenue,
      totalSales,
      orders: totalSales,
      conversionRate,
      visitors,
      activeCampaigns,
      roi,
      growthPercentage: totalRevenue > 0 ? 12.4 : 0,
      productCount: totals?.productCount || 0,
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/dashboard/revenue-trend
// Returns monthly revenue for the line/bar chart
const getRevenueTrend = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const trend = await Product.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$revenue" },
          sales: { $sum: "$sales" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      trend: trend.map((t) => ({ month: t._id, revenue: t.revenue, sales: t.sales })),
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/dashboard/category-breakdown
// Returns product distribution by category for the pie chart
const getCategoryBreakdown = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const breakdown = await Product.aggregate([
      { $match: { owner: ownerId } },
      { $group: { _id: "$category", count: { $sum: 1 }, revenue: { $sum: "$revenue" } } },
      { $sort: { revenue: -1 } },
    ]);

    res.json({ breakdown: breakdown.map((b) => ({ category: b._id || "Uncategorized", count: b.count, revenue: b.revenue })) });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary, getRevenueTrend, getCategoryBreakdown };

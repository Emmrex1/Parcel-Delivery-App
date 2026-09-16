import {
  getDashboardStatsData,
  getLastMonths,
} from "../services/analyticsService.js";

import Parcel from "../model/Parcel.js";

// GET DASHBOARD STATS
export const getDashboardStats = async (
  req,
  res,
  next
) => {
  try {
    const data = await getDashboardStatsData();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// GET REVENUE ANALYTICS
export const getRevenueAnalytics = async (
  req,
  res,
  next
) => {
  try {
    const data = await getDashboardStatsData();

    return res.status(200).json({
      success: true,
      data: data.monthlyRevenue,
    });
  } catch (error) {
    next(error);
  }
};

// GET PARCEL GROWTH
export const getParcelGrowth = async (
  req,
  res,
  next
) => {
  try {
    const data = await getDashboardStatsData();

    return res.status(200).json({
      success: true,
      data: data.monthlyParcels,
    });
  } catch (error) {
    next(error);
  }
};

// GET TOP CITIES
export const getTopCities = async (
  req,
  res,
  next
) => {
  try {
    const requestedLimit = Number.parseInt(
      req.query.limit,
      10
    );

    const limit =
      Number.isInteger(requestedLimit) &&
      requestedLimit > 0
        ? Math.min(requestedLimit, 20)
        : 8;

    const rows = await Parcel.aggregate([
      {
        $match: {
          destinationCity: {
            $type: "string",
            $ne: "",
          },
        },
      },

      {
        $group: {
          _id: "$destinationCity",
          parcels: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          parcels: -1,
        },
      },

      {
        $limit: limit,
      },

      {
        $project: {
          _id: 0,
          city: "$_id",
          parcels: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// GET DELIVERY PERFORMANCE
export const getDeliveryPerformance = async (
  req,
  res,
  next
) => {
  try {
    const months = getLastMonths(12);

    const startDate = months[0].start;

    const aggregation = await Parcel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
          },
        },
      },

      {
        $project: {
          year: {
            $year: "$createdAt",
          },

          month: {
            $month: "$createdAt",
          },

          currentStatus: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$checkpoints.status",
                  -1,
                ],
              },
              "arrived",
            ],
          },
        },
      },

      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
          },

          total: {
            $sum: 1,
          },

          delivered: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$currentStatus",
                    "delivered",
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,

          key: {
            $concat: [
              {
                $toString: "$_id.year",
              },

              "-",

              {
                $cond: [
                  {
                    $lt: [
                      "$_id.month",
                      10,
                    ],
                  },

                  {
                    $concat: [
                      "0",
                      {
                        $toString:
                          "$_id.month",
                      },
                    ],
                  },

                  {
                    $toString:
                      "$_id.month",
                  },
                ],
              },
            ],
          },

          total: 1,
          delivered: 1,
        },
      },
    ]);

    const byKey = {};

    for (const row of aggregation) {
      const deliveryRate =
        row.total > 0
          ? (row.delivered / row.total) * 100
          : 0;

      const delayedRate =
        row.total > 0
          ? 100 - deliveryRate
          : 0;

      byKey[row.key] = {
        ...row,

        onTime: {
          onTime: Number(
            deliveryRate.toFixed(2)
          ),

          delayed: Number(
            delayedRate.toFixed(2)
          ),
        },
      };
    }

    const result = months.map((month) => {
      const existing = byKey[month.key];

      if (existing) {
        return {
          month: month.month,
          ...existing,
        };
      }

      return {
        month: month.month,
        key: month.key,
        total: 0,
        delivered: 0,

        onTime: {
          onTime: 0,
          delayed: 0,
        },
      };
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// GET ANALYTICS SUMMARY
export const getAnalyticsSummary = async (req, res, next) => {
  try {
    const data = await getDashboardStatsData();

    const cities = await Parcel.distinct("destinationCity", {
      destinationCity: {
        $type: "string",
        $ne: "",
      },
    });

  
    const citiesServed = cities.filter(
      (city) =>
        typeof city === "string" &&
        city.trim() !== ""
    ).length;

    return res.status(200).json({
      success: true,
      data: {
        totals: data.totals,
        statusDistribution: data.statusDistribution,
        weightDistribution: data.weightDistribution,
        citiesServed,
      },
    });
  } catch (error) {
    next(error);
  }
};
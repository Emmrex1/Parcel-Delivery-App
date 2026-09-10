import Parcel from "../model/Parcel.js";
import User from "../model/User.js";


const MONTH_LABELS = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];


const toMonthKey = (date) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}`;
};

export const getLastMonths = (n) => {
  const now = new Date();

  const months = [];

  for (let i = n - 1; i >= 0; i -= 1) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    months.push({
      key: toMonthKey(date),

      month:
        MONTH_LABELS[date.getMonth()],

      start: new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      ),
    });
  }

  return months;
};

const arrayToKeyedMap = (
  rows,
  keyField,
  valueField
) => {
  const out = {};

  for (const row of rows || []) {
    if (
      row &&
      row[keyField] !== undefined
    ) {
      out[row[keyField]] = row[valueField] ?? 0;
    }
  }

  return out;
};


const monthKeyProject = (groupIdPath) => ({
  $concat: [
    {
      $toString:
        `${groupIdPath}.year`,
    },

    "-",

    {
      $cond: [
        {
          $lt: [
            `${groupIdPath}.month`,
            10,
          ],
        },

        {
          $concat: [
            "0",

            {
              $toString:
                `${groupIdPath}.month`,
            },
          ],
        },

        {
          $toString:
            `${groupIdPath}.month`,
        },
      ],
    },
  ],
});


const WEIGHT_BUCKETS = [
  {  id: 0,  range: "0-1kg", boundary: 0, },

  { id: 1, range: "1-3kg", boundary: 1,},

  {id: 2, range: "3-5kg",  boundary: 3,},

  { id: 3, range: "5-10kg", boundary: 5, },

  { id: 4, range: "10-20kg", boundary: 10,},

  { id: 5, range: "20-50kg", boundary: 20, },

  { id: 6, range: "50kg+", boundary: 50, },
];


export const getDashboardStatsData =
  async () => {
    const months = getLastMonths(12);

    const startDate =
      months[0].start;

    const [
      totalParcels,
      totalUsers,
      totalRevenueAgg,
      parcelsPerMonthAgg,
      revenuePerMonthAgg,
      usersPerMonthAgg,
      statusAgg,
      weightBucketAgg,
    ] = await Promise.all([

      Parcel.countDocuments(),

      User.countDocuments(),


      Parcel.aggregate([
        {
          $group: {
            _id: null,

            revenue: {
              $sum: "$price",
            },
          },
        },
      ]),


      Parcel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
            },
          },
        },

        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            parcels: {
              $sum: 1,
            },
          },
        },

        {
          $project: {
            _id: 0,

            key: monthKeyProject(
              "$_id"
            ),

            parcels: 1,
          },
        },
      ]),

    
      Parcel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
            },
          },
        },

        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            revenue: {
              $sum: "$price",
            },
          },
        },

        {
          $project: {
            _id: 0,

            key: monthKeyProject(
              "$_id"
            ),

            revenue: 1,
          },
        },
      ]),


      User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
            },
          },
        },

        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            users: {
              $sum: 1,
            },
          },
        },

        {
          $project: {
            _id: 0,

            key: monthKeyProject(
              "$_id"
            ),

            users: 1,
          },
        },
      ]),


      Parcel.aggregate([
        {
          $project: {
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
            _id: "$currentStatus",

            value: {
              $sum: 1,
            },
          },
        },

        {
          $project: {
            _id: 0,

            status: "$_id",

            value: 1,
          },
        },
      ]),

      Parcel.aggregate([
        {
          $match: {
            weight: {
              $gte: 0,
            },
          },
        },

        {
          $bucket: {
            groupBy: "$weight",

            boundaries: [
              0, 1, 3, 5, 10, 20, 50, 1000000000, ],

            default: "unknown",

            output: {
              count: {
                $sum: 1,
              },
            },
          },
        },
      ]),
    ]);

    

    const totalRevenue =
      totalRevenueAgg?.[0]?.revenue ||
      0;

    const parcelsByMonth =
      arrayToKeyedMap(
        parcelsPerMonthAgg,
        "key",
        "parcels"
      );

    const revenueByMonth =
      arrayToKeyedMap(
        revenuePerMonthAgg,
        "key",
        "revenue"
      );

    const usersByMonth =
      arrayToKeyedMap(
        usersPerMonthAgg,
        "key",
        "users"
      );


    const monthlyParcels =
      months.map((m) => ({
        month: m.month,

        parcels:
          parcelsByMonth[m.key] || 0,
      }));


    const monthlyRevenue =
      months.map((m) => ({
        month: m.month,

        revenue:
          revenueByMonth[m.key] || 0,
      }));


    const userGrowth =
      months.map((m) => ({
        month: m.month,

        users:
          usersByMonth[m.key] || 0,
      }));


    const statusDistribution = [
  "arrived",
  "in_transit",
  "out_for_delivery",
  "delivered",
].map((status) => {
  const found = statusAgg.find(
    (row) => row.status === status
  );

  return {
    name: status,
    value: found ? found.value : 0,
  };
});

    const weightDistribution =
      WEIGHT_BUCKETS.map((bucket) => {
        const found =
          weightBucketAgg.find(
            (row) =>
              row._id ===
              bucket.boundary
          );

        return {
          id: bucket.id,

          range: bucket.range,

          count: found
            ? found.count
            : 0,
        };
      });

    return {
      totals: {
        parcels: totalParcels,

        users: totalUsers,

        revenue: totalRevenue,
      },

      monthlyParcels,

      monthlyRevenue,

      userGrowth,

      statusDistribution,

      weightDistribution,
    };
  };
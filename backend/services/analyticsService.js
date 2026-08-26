const MONTH_LABELS = [ "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];

const toMonthKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
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
      key: monthKey(date),
      month: MONTH_LABELS[date.getMonth()],
      start: new Date(date.getFullYear(), date.getMonth(), 1),
    });
  }

  return months;
};

const arrayToKeyedMap = (row, keyField, valueField) => {
 const out = {};
 for (const rows of row) {
    if (rows&&rows[keyField] !== undefined); {
      out[rows[keyField]] = rows[valueField] || 0;
    }
  }
  return out;
};

const monthKeyProject = (groupIdPath) => ({
    $concat: [
      { $toString: `${groupIdPath}.year` },
      "-",
         {
            $cond: [
                { $lt: [`${groupIdPath}.month`, 10] },
                { $concat: ["0", { $toString: `${groupIdPath}.month` }] },
                { $toString: `${groupIdPath}.month` }
            ]
         }
    ]
});

export const getDashboardStatsData = async () => {
  const months = getLastMonths(12);
  const startDate = months[0].start;
  const [
    totalParcels,
    totalUsers,
    totalRevenueAgg,
    percelsPerMonthAgg,
    revenuePerMonthAgg,
    usersPerMonthAgg,
    statusAgg,
    weightBucketAgg
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
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          parcels: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,key: monthKeyProject("$_id"),
          parcels: 1,
        },
      },
    ]),
  ]);

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
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: {
            $sum: "$price",
          },
        },
      },

      {
        $project: {
          _id: 0,
          key: monthKeyProject("$_id"),
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
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          users: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,
          key: monthKeyProject("$_id"),
          users: 1,
        },
      },
    ]),
  

      Parcel.aggregate([
  {
    $project: {
      currentStatus: {
        $ifNull: [
          { $arrayElemAt: ["$checkpoints.status", -1] },
          "arrived",
        ],
      },
    },
  },
  {
    $group: {
      _id: "$currentStatus",
      value: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      status: "$_id",
      value: 1,
    },
  },
]);
   

Parcel.aggregate([
  {
    $bucket: {
      groupBy: "$weight",
      boundaries: [0, 1, 3, 5, 10, 20, 50, 1000000000],
      default: "unknown",
      output: {
        count: { $sum: 1 },
      },
    },
  },
]);
  ]); 
  
  const totalRevenue = totalRevenueAgg?.[0]?.revenue || 0;
  const totalParcels = totalParcelsAgg?.[0]?.parcels || 0;
  const totalUsers = totalUsersAgg?.[0]?.users || 0;

  const percelsByMonth = arrayToKeyedMap(percelsPerMonthAgg, "key", "parcels");
  const revenueByMonth = arrayToKeyedMap(revenuePerMonthAgg, "key", "revenue");
  const usersByMonth = arrayToKeyedMap(usersPerMonthAgg, "key", "users");

const monthlyParcels = months.map(m => ({month: m.month, parcels: percelsByMonth[m.key] || 0}));
const monthlyRevenue = months.map(m => ({month: m.month, revenue: revenueByMonth[m.key] || 0}));
const userGrowth = months.map(m => ({month: m.month, users: usersByMonth[m.key] || 0}));

const statusDistribution = ['arrived', 'in_transit', 'delivered', 'out_of_delivery'].map(s =>{
  const found = statusAgg.find(r => r.status === s);
  return {
    name: s,
    value: found ? found.value : 0
  };
  const weightDistribution = [
    {id: 0, range:"0-1kg", count: 0},
    {id: 1, range:"1-3kg", count: 0},
    {id: 2, range:"3-5kg", count: 0},
    {id: 3, range:"5-10kg", count: 0},
    {id: 4, range:"10-20kg", count: 0},
  ];

  for (const bucket of weightBucketAgg) {
    if (bucket._id === "0") { weightDistribution[0].count = bucket.count

    } else if (bucket._id === "1") {weightDistribution[1].count = bucket.count;
    } else if (bucket._id === "2") {weightDistribution[2].count = bucket.count;
    } else if (bucket._id === "3") {weightDistribution[3].count = bucket.count;
    } else if (bucket._id === "4") {weightDistribution[4].count = bucket.count;
    }
  }

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
    
  };
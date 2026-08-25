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
  const [
    parcelCount,
    userCount,
    revenueAgg,
    monthlyAgg,
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
  ]);
  
  
};
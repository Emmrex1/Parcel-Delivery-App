import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Package, Search, ArrowRight, Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fetchMyShipmentsThunk } from "@/features/slice/parcelSlice";

const MyShipments = () => {
  const dispatch = useDispatch();

  const { myShipments, shipmentsLoading, shipmentsError } = useSelector(
    (state) => state.parcels,
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchMyShipmentsThunk());
  }, [dispatch]);

  const filteredShipments = useMemo(() => {
    const shipments = Array.isArray(myShipments) ? myShipments : [];

    return shipments.filter((parcel) => {
      const matchesSearch =
        !search ||
        parcel.trackingNumber?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "all" || parcel.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [myShipments, search, status]);

  const formatStatus = (value) => {
    switch (value) {
      case "pending":
        return "Pending";

      case "arrived":
        return "Arrived";

      case "in_transit":
        return "In Transit";

      case "out_for_delivery":
        return "Out for Delivery";

      case "delivered":
        return "Delivered";

      default:
        return "Unknown";
    }
  };

  const getStatusClasses = (value) => {
    switch (value) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "in_transit":
        return "bg-blue-100 text-blue-700";

      case "out_for_delivery":
        return "bg-orange-100 text-orange-700";

      case "arrived":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">Customer Dashboard</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            My Shipments
          </h1>

          <p className="mt-2 text-muted-foreground">
            View and track all your RapidXpress shipments.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tracking number..."
              className="h-10 w-full rounded-md border bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="arrived">Arrived</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
          </select>

          <Button
            variant="outline"
            onClick={() => dispatch(fetchMyShipmentsThunk())}
            disabled={shipmentsLoading}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${shipmentsLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Loading */}
        {shipmentsLoading && (
          <div className="flex min-h-64 items-center justify-center rounded-xl border bg-background">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />

              <p className="text-sm text-muted-foreground">
                Loading your shipments...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!shipmentsLoading && shipmentsError && (
          <div className="rounded-xl border bg-background px-6 py-12 text-center">
            <p className="text-sm text-destructive">{shipmentsError}</p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => dispatch(fetchMyShipmentsThunk())}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty */}
        {!shipmentsLoading &&
          !shipmentsError &&
          filteredShipments.length === 0 && (
            <div className="rounded-xl border bg-background px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Package className="h-7 w-7 text-muted-foreground" />
              </div>

              <h2 className="mt-4 text-lg font-semibold">No shipments found</h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {search || status !== "all"
                  ? "Try changing your search or status filter."
                  : "You haven't created any shipments yet."}
              </p>
            </div>
          )}

        {/* Shipments */}
        {!shipmentsLoading &&
          !shipmentsError &&
          filteredShipments.length > 0 && (
            <div className="space-y-4">
              {filteredShipments.map((parcel) => (
                <div
                  key={parcel._id}
                  className="rounded-xl border bg-background p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-semibold">
                          {parcel.trackingNumber}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                            parcel.status,
                          )}`}
                        >
                          {formatStatus(parcel.status)}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {parcel.originCity} → {parcel.destinationCity}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                        <span>
                          Category:{" "}
                          <strong className="text-foreground">
                            {parcel.parcelCategory}
                          </strong>
                        </span>

                        <span>
                          Weight:{" "}
                          <strong className="text-foreground">
                            {parcel.weight} kg
                          </strong>
                        </span>

                        <span>
                          Price:{" "}
                          <strong className="text-foreground">
                            ₦{Number(parcel.price || 0).toLocaleString()}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <Link to={`/my-shipments/${parcel._id}`}>
                      <Button
                        variant="outline"
                        className="w-full gap-2 sm:w-auto"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default MyShipments;

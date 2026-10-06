import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  ArrowRight,
  Plus,
  Search,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { fetchMyShipmentsThunk } from "@/features/slice/parcelSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { myShipments, shipmentsLoading, shipmentsError } = useSelector(
    (state) => state.parcels,
  );

  useEffect(() => {
    dispatch(fetchMyShipmentsThunk());
  }, [dispatch]);

  const statistics = useMemo(() => {
    const shipments = Array.isArray(myShipments) ? myShipments : [];

    return {
      total: shipments.length,

      inTransit: shipments.filter(
        (parcel) =>
          parcel.status === "in_transit" ||
          parcel.status === "out_for_delivery",
      ).length,

      delivered: shipments.filter((parcel) => parcel.status === "delivered")
        .length,

      pending: shipments.filter((parcel) => parcel.status === "pending").length,
    };
  }, [myShipments]);

  const recentShipments = useMemo(() => {
    return [...(myShipments || [])]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  }, [myShipments]);

  const formatStatus = (status) => {
    switch (status) {
      case "pending":
        return "pending";

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

  const getStatusClasses = (status) => {
    switch (status) {
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

      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm text-muted-foreground">Customer Dashboard</p>

            <h1 className="mt-1 text-2xl font-display font-bold tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Customer"} 👋
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your shipments and track your deliveries.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
       
        <div className="sm:hidden">
          <Link to="/send-parcel">
            <Button className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4" />
              Send a Parcel
            </Button>
          </Link>
        </div>

        <section>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Total */}

            <div className="rounded-xl border bg-background p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Shipments
                  </p>

                  <p className="mt-2 text-3xl font-bold">{statistics.total}</p>
                </div>

                <div className="rounded-lg bg-accent/10 p-3">
                  <Package className="h-5 w-5 text-accent" />
                </div>
              </div>
            </div>

            {/* In Transit */}

            <div className="rounded-xl border bg-background p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Transit</p>

                  <p className="mt-2 text-3xl font-bold">
                    {statistics.inTransit}
                  </p>
                </div>

                <div className="rounded-lg bg-blue-100 p-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Delivered */}

            <div className="rounded-xl border bg-background p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>

                  <p className="mt-2 text-3xl font-bold">
                    {statistics.delivered}
                  </p>
                </div>

                <div className="rounded-lg bg-green-100 p-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Pending */}

            <div className="rounded-xl border bg-background p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>

                  <p className="mt-2 text-3xl font-bold">
                    {statistics.pending}
                  </p>
                </div>

                <div className="rounded-lg bg-orange-100 p-3">
                  <Clock3 className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/send-parcel"
              className="group rounded-xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Send a Parcel</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Create a new shipment and get your tracking number.
                  </p>
                </div>

                <div className="rounded-lg bg-accent/10 p-3">
                  <Plus className="h-5 w-5 text-accent" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent">
                Create shipment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              to="/track"
              className="group rounded-xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Track a Parcel</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter a tracking number to check shipment progress.
                  </p>
                </div>

                <div className="rounded-lg bg-blue-100 p-3">
                  <Search className="h-5 w-5 text-blue-600" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent">
                Track shipment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </section>

        <section className="rounded-xl border bg-background shadow-sm">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-semibold">Recent Shipments</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Your latest parcel activity
              </p>
            </div>

            <Link
              to="/my-shipments"
              className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {shipmentsLoading ? (
            <div className="flex min-h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : shipmentsError ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-destructive">{shipmentsError}</p>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => dispatch(fetchMyShipmentsThunk())}
              >
                Try again
              </Button>
            </div>
          ) : recentShipments.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">No shipments yet</h3>

              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                You haven't created any shipments yet. Send your first parcel to
                get started.
              </p>

              <Link to="/send-parcel">
                <Button className="mt-5 gap-2">
                  <Plus className="h-4 w-4" />
                  Send a Parcel
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentShipments.map((parcel) => (
                <div
                  key={parcel._id}
                  className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{parcel.trackingNumber}</p>

                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {parcel.originCity} → {parcel.destinationCity}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                        parcel.status,
                      )}`}
                    >
                      {formatStatus(parcel.status)}
                    </span>

                    <Link
                      to={`/my-shipments/${parcel._id}`}
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

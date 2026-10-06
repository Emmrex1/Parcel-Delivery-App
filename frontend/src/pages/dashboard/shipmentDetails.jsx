import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  Phone,
  Scale,
  Truck,
  Loader2,
  CheckCircle2,
  Clock3,
  Globe2,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  fetchMyShipmentByIdThunk,
  clearSelectedShipment,
} from "@/features/slice/parcelSlice";

const ShipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedShipment, selectedShipmentLoading, selectedShipmentError } =
    useSelector((state) => state.parcels);

  useEffect(() => {
    if (id) {
      dispatch(fetchMyShipmentByIdThunk(id));
    }

    return () => {
      dispatch(clearSelectedShipment());
    };
  }, [dispatch, id]);

  const formatStatus = (status) => {
    switch (status) {
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

  const getStatusClasses = (status) => {
    switch (status) {
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

  const formatLabel = (value) => {
    if (!value) return "—";

    return value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (selectedShipmentLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />

          <p className="text-sm text-muted-foreground">Loading shipment...</p>
        </div>
      </div>
    );
  }

  if (selectedShipmentError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Package className="mx-auto h-10 w-10 text-muted-foreground" />

        <h1 className="mt-4 text-xl font-semibold">Shipment not found</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {selectedShipmentError}
        </p>

        <Button
          className="mt-6"
          variant="outline"
          onClick={() => navigate("/my-shipments")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Shipments
        </Button>
      </div>
    );
  }

  if (!selectedShipment) {
    return null;
  }

  const parcel = selectedShipment;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          to="/my-shipments"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Shipments
        </Link>

        {/* Header */}
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tracking Number</p>

              <h1 className="mt-1 text-2xl font-bold">
                {parcel.trackingNumber}
              </h1>

              {parcel.createdAt && (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />

                  <span>Created {formatDate(parcel.createdAt)}</span>
                </div>
              )}
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${getStatusClasses(
                parcel.status,
              )}`}
            >
              {formatStatus(parcel.status)}
            </span>
          </div>
        </div>

        {/* Route */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {/* Origin */}
          <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-accent/10 p-3">
                <MapPin className="h-5 w-5 text-accent" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">From</p>

                <p className="font-semibold">{parcel.originCity}</p>

                <p className="mt-1 text-sm text-muted-foreground">Nigeria</p>
              </div>
            </div>
          </div>

          {/* Destination */}
          <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-3">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">To</p>

                <p className="font-semibold">{parcel.destinationCity}</p>

                {parcel.destinationCountry && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {parcel.destinationCountry}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Information */}
        <div className="mt-6 rounded-xl border bg-background p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Shipment Information</h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {/* Shipment Type */}
            <div>
              <p className="text-xs text-muted-foreground">Shipment Type</p>

              <p className="mt-1 font-medium">
                {formatLabel(parcel.shipmentType)}
              </p>
            </div>

            {/* Category */}
            <div>
              <p className="text-xs text-muted-foreground">Category</p>

              <p className="mt-1 font-medium">
                {formatLabel(parcel.parcelCategory)}
              </p>
            </div>

            {/* Weight */}
            <div>
              <p className="text-xs text-muted-foreground">Weight</p>

              <p className="mt-1 flex items-center gap-2 font-medium">
                <Scale className="h-4 w-4" />
                {parcel.weight} kg
              </p>
            </div>

            {/* Delivery Type */}
            <div>
              <p className="text-xs text-muted-foreground">Delivery Type</p>

              <p className="mt-1 font-medium">
                {formatLabel(parcel.deliveryType)}
              </p>
            </div>

            {/* Price */}
            <div>
              <p className="text-xs text-muted-foreground">Price</p>

              <p className="mt-1 font-semibold">
                ₦{Number(parcel.price || 0).toLocaleString("en-NG")}
              </p>
            </div>
          </div>
        </div>

        {/* Sender / Receiver */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Sender */}
          <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-accent" />

              <h2 className="font-semibold">Sender</h2>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">Name:</span>{" "}
                {parcel.senderName}
              </p>

              <p className="flex gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />

                {parcel.senderPhone}
              </p>

              <p>
                <span className="text-muted-foreground">Address:</span>{" "}
                {parcel.senderAddress}
              </p>
            </div>
          </div>

          {/* Receiver */}
          <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-600" />

              <h2 className="font-semibold">Receiver</h2>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">Name:</span>{" "}
                {parcel.receiverName}
              </p>

              <p className="flex gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />

                {parcel.receiverPhone}
              </p>

              <p>
                <span className="text-muted-foreground">Address:</span>{" "}
                {parcel.receiverAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="mt-6 rounded-xl border bg-background p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-accent" />

            <div>
              <h2 className="text-lg font-semibold">Tracking Timeline</h2>

              <p className="text-sm text-muted-foreground">
                Follow the progress of your shipment.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {parcel.checkpoints?.length > 0 ? (
              [...parcel.checkpoints].reverse().map((checkpoint, index) => {
                const isDelivered = checkpoint.status === "delivered";

                const isPending = checkpoint.status === "pending";

                return (
                  <div
                    key={`${checkpoint.timestamp}-${index}`}
                    className="relative flex gap-4"
                  >
                    {/* Timeline icon */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          isDelivered
                            ? "bg-green-100"
                            : isPending
                              ? "bg-yellow-100"
                              : "bg-accent/10"
                        }`}
                      >
                        {isDelivered ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : isPending ? (
                          <Clock3 className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <Clock3 className="h-5 w-5 text-accent" />
                        )}
                      </div>

                      {index !== parcel.checkpoints.length - 1 && (
                        <div className="mt-2 h-full w-px bg-border" />
                      )}
                    </div>

                    {/* Timeline information */}
                    <div className="pb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{checkpoint.title}</h3>

                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(
                            checkpoint.status,
                          )}`}
                        >
                          {formatStatus(checkpoint.status)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />

                        <span>
                          {checkpoint.location || "Location unavailable"}
                        </span>
                      </div>

                      {checkpoint.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {checkpoint.description}
                        </p>
                      )}

                      {checkpoint.timestamp && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {formatDate(checkpoint.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-dashed px-5 py-8 text-center">
                <Clock3 className="mx-auto h-6 w-6 text-muted-foreground" />

                <p className="mt-2 text-sm text-muted-foreground">
                  No tracking updates available yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Package,
  Truck,
  User,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StatusBadge } from "@/components/StatusBadge";
import { TrackingTimeline } from "@/components/TrackingTimeline";

import { addCheckpointThunk } from "@/features/parcels/parcelSlice";
import { axiosInstance } from "@/services/axiosInstance";

import { toast } from "sonner";

const STATUS_OPTIONS = [
  {
    value: "arrived",
    label: "Arrived",
  },
  {
    value: "in_transit",
    label: "In Transit",
  },
  {
    value: "out_for_delivery",
    label: "Out for Delivery",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
];

const STATUS_ORDER = {
  arrived: 0,
  in_transit: 1,
  out_for_delivery: 2,
  delivered: 3,
};

const initialCheckpoint = {
  location: "",
  title: "",
  description: "",
  status: "in_transit",
};

const getParcelStatus = (parcel) => {
  if (parcel?.status) {
    return parcel.status;
  }

  const checkpoints = parcel?.checkpoints || [];

  return checkpoints.at(-1)?.status || "arrived";
};

const formatLabel = (value) => {
  if (!value) return "-";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount) => {
  return `₦${Number(amount || 0).toLocaleString("en-NG")}`;
};

export default function ParcelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { updateLoading, updateError } = useSelector(
    (state) => state.parcels,
  );

  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkpoint, setCheckpoint] = useState(
    initialCheckpoint,
  );

  //  Fetch Parcel

  useEffect(() => {
    let isMounted = true;

    const fetchParcel = async () => {
      if (!id) {
        setError("Invalid parcel ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data } = await axiosInstance.get(
          `/parcels/${id}`,
        );

        if (!data?.parcel) {
          throw new Error("Parcel not found.");
        }

        if (isMounted) {
          setParcel(data.parcel);
        }
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load parcel details.";

        if (isMounted) {
          setError(message);
          setParcel(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchParcel();

    return () => {
      isMounted = false;
    };
  }, [id]);

  //  Current Status

  const currentStatus = useMemo(
    () => getParcelStatus(parcel),
    [parcel],
  );

  const currentStatusIndex =
    STATUS_ORDER[currentStatus] ?? 0;

  const isDelivered = currentStatus === "delivered";

  //  Add Checkpoint

  const addCheckpoint = async () => {
    if (isDelivered) {
      toast.info(
        "This parcel has already been delivered.",
      );
      return;
    }

    if (!checkpoint.location.trim()) {
      toast.error("Please enter the checkpoint location.");
      return;
    }

    if (!checkpoint.title.trim()) {
      toast.error("Please enter the checkpoint title.");
      return;
    }

    if (!checkpoint.status) {
      toast.error("Please select a checkpoint status.");
      return;
    }

    if (!parcel?._id) {
      toast.error("Parcel information is unavailable.");
      return;
    }

    const selectedStatusIndex =
      STATUS_ORDER[checkpoint.status] ?? 0;

    if (selectedStatusIndex < currentStatusIndex) {
      toast.error(
        `You cannot move the parcel backward from ${formatLabel(
          currentStatus,
        )} to ${formatLabel(checkpoint.status)}.`,
      );
      return;
    }

    const result = await dispatch(
      addCheckpointThunk({
        id: parcel._id,
        checkpoint: {
          location: checkpoint.location.trim(),
          title: checkpoint.title.trim(),
          description: checkpoint.description.trim(),
          status: checkpoint.status,
        },
      }),
    );

    if (addCheckpointThunk.fulfilled.match(result)) {
      const updatedParcel = result.payload;

      if (updatedParcel) {
        setParcel(updatedParcel);
      }

      setCheckpoint(initialCheckpoint);

      toast.success(
        "Checkpoint added successfully.",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />

          <p className="text-sm text-muted-foreground">
            Loading parcel details...
          </p>
        </div>
      </div>
    );
  }

  //  Error / Not Found
  

  if (error || !parcel) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 text-center">
        <Package className="h-10 w-10 text-muted-foreground" />

        <div>
          <h2 className="text-lg font-semibold">
            Parcel Not Found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {error || "We could not find this parcel."}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate("/parcels")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go to Manage Parcels
        </Button>
      </div>
    );
  }

  // Information Row
 

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between gap-4 border-b border-border/50 py-2 last:border-0">
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>

      <span className="max-w-[65%] text-right text-sm font-medium">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="mx-auto max-w-5xl space-y-6"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mt-1 shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="break-all font-mono text-xl font-bold sm:text-2xl">
              {parcel.trackingNumber || "-"}
            </h1>

            <StatusBadge status={currentStatus} />
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Parcel Details
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Sender */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center gap-2">
              <User className="h-4 w-4 text-primary" />

              <CardTitle className="text-base">
                Sender Information
              </CardTitle>
            </CardHeader>

            <CardContent>
              <InfoRow
                label="Name"
                value={parcel.senderName}
              />

              <InfoRow
                label="Phone"
                value={parcel.senderPhone}
              />

              <InfoRow
                label="Address"
                value={parcel.senderAddress}
              />
            </CardContent>
          </Card>

          {/* Receiver */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center gap-2">
              <User className="h-4 w-4 text-primary" />

              <CardTitle className="text-base">
                Receiver Information
              </CardTitle>
            </CardHeader>

            <CardContent>
              <InfoRow
                label="Name"
                value={parcel.receiverName}
              />

              <InfoRow
                label="Phone"
                value={parcel.receiverPhone}
              />

              <InfoRow
                label="Address"
                value={parcel.receiverAddress}
              />
            </CardContent>
          </Card>

          {/* Shipment Details */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center gap-2">
              <Package className="h-4 w-4 text-primary" />

              <CardTitle className="text-base">
                Shipment Details
              </CardTitle>
            </CardHeader>

            <CardContent>
              <InfoRow
                label="Shipment Type"
                value={formatLabel(parcel.shipmentType)}
              />

              <InfoRow
                label="Delivery Type"
                value={formatLabel(parcel.deliveryType)}
              />

              <InfoRow
                label="Category"
                value={formatLabel(parcel.parcelCategory)}
              />

              <InfoRow
                label="Weight"
                value={`${parcel.weight || 0} kg`}
              />

              <InfoRow
                label="Price"
                value={formatCurrency(parcel.price)}
              />

              <InfoRow
                label="Created"
                value={formatDate(parcel.createdAt)}
              />

              <InfoRow
                label="Last Updated"
                value={formatDateTime(parcel.updatedAt)}
              />
            </CardContent>
          </Card>

          {/* Add Checkpoint */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">
                Update Parcel Status
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Add a tracking checkpoint to update the
                parcel's current status.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {isDelivered ? (
                <div className="rounded-lg border border-success/20 bg-success/5 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />

                    <div>
                      <p className="font-medium">
                        Parcel Delivered
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        This parcel has reached its final
                        delivery status. No further checkpoint
                        can be added.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Location */}
                  <div className="space-y-1">
                    <Label htmlFor="checkpoint-location">
                      Location *
                    </Label>

                    <Input
                      id="checkpoint-location"
                      placeholder="e.g. Lagos Branch"
                      value={checkpoint.location}
                      disabled={updateLoading}
                      onChange={(e) =>
                        setCheckpoint((previous) => ({
                          ...previous,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <Label htmlFor="checkpoint-title">
                      Title *
                    </Label>

                    <Input
                      id="checkpoint-title"
                      placeholder="e.g. Parcel arrived at Lagos Branch"
                      value={checkpoint.title}
                      disabled={updateLoading}
                      onChange={(e) =>
                        setCheckpoint((previous) => ({
                          ...previous,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <Label htmlFor="checkpoint-description">
                      Description
                    </Label>

                    <Textarea
                      id="checkpoint-description"
                      placeholder="Describe what happened to the parcel..."
                      rows={3}
                      disabled={updateLoading}
                      value={checkpoint.description}
                      onChange={(e) =>
                        setCheckpoint((previous) => ({
                          ...previous,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <Label>Status *</Label>

                    <Select
                      value={checkpoint.status}
                      disabled={updateLoading}
                      onValueChange={(value) =>
                        setCheckpoint((previous) => ({
                          ...previous,
                          status: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => {
                          const optionIndex =
                            STATUS_ORDER[option.value];

                          const disabled =
                            optionIndex < currentStatusIndex;

                          return (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              disabled={disabled}
                            >
                              {option.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {updateError && (
                    <p className="text-sm text-destructive">
                      {updateError}
                    </p>
                  )}

                  <Button
                    type="button"
                    onClick={addCheckpoint}
                    disabled={updateLoading}
                    className="w-full"
                  >
                    {updateLoading
                      ? "Saving Checkpoint..."
                      : "Add Checkpoint"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Route */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />

              <CardTitle className="text-base">
                Route
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Origin
                  </p>

                  <p className="mt-1 break-words font-semibold">
                    {parcel.originCity || "-"}
                  </p>
                </div>

                <Truck className="mx-auto h-5 w-5 rotate-90 text-muted-foreground sm:rotate-0" />

                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Destination
                  </p>

                  <p className="mt-1 break-words font-semibold">
                    {parcel.destinationCity || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">
                Tracking Timeline
              </CardTitle>
            </CardHeader>

            <CardContent>
              <TrackingTimeline
                checkpoints={parcel.checkpoints || []}
              />
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">
                Current Status
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between gap-4 rounded-lg bg-muted p-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Current shipment status
                  </p>

                  <p className="mt-1 font-semibold">
                    {formatLabel(currentStatus)}
                  </p>
                </div>

                <StatusBadge status={currentStatus} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

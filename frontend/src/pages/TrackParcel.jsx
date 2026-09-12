
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Package, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import TrackingTimeline from "@/components/TrackingTimeline";
import { trackParcelThunk } from "../store/slice/parcelSlice";


const statusColors = {
  arrived: "bg-muted text-muted-foreground",
  in_transit: "bg-primary/10 text-primary",
  out_for_delivery: "bg-accent/10 text-accent",
  delivered: "bg-green-100 text-green-700",
};

const TrackParcel = () => {
  const [searchParams] = useSearchParams();

  const [trackingId, setTrackingId] = useState(
    searchParams.get("id") || ""
  );

  const dispatch = useDispatch();

  const {
    trackParcel: parcel,
    trackLoading: loading,
    trackError,
  } = useSelector((state) => state.parcels);


  const handleTrack = async () => {
    const id = trackingId.trim();

    if (!id) return;

    await dispatch(trackParcelThunk(id));
  };

  useEffect(() => { 
    const id = searchParams.get("id");

    if (id) {
      setTrackingId(id);
      dispatch(trackParcelThunk(id.trim()));
    }
  }, [searchParams, dispatch]);

  const currentStatus =
    parcel?.checkpoints?.length > 0
      ? parcel.checkpoints[parcel.checkpoints.length - 1].status
      : "arrived";

  const formattedStatus = currentStatus.replace(/_/g, " ");

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Track Your Parcel
          </h1>

          <p className="text-muted-foreground mt-2">
            Enter your tracking ID to see the latest delivery updates
          </p>
        </motion.div>

        {/* Tracking Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-lg mx-auto flex gap-2 mb-12"
        >
          <Input
            placeholder="Enter Tracking ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTrack();
              }
            }}
          />

          <Button
            onClick={handleTrack}
            disabled={loading || !trackingId.trim()}
            className="bg-primary text-primary-foreground shrink-0"
          >
            <Search className="mr-2 h-4 w-4" />

            {loading ? "Tracking..." : "Track"}
          </Button>
        </motion.div>

       
        {loading && (
          <div className="max-w-2xl mx-auto space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        )}

       
        {trackError && !loading && !parcel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>

            <h3 className="font-display font-semibold text-lg text-foreground">
              Parcel Not Found
            </h3>

            <p className="text-sm text-muted-foreground mt-2">
              {trackError ||
                "We couldn't find a parcel with that tracking ID. Please double-check and try again."}
            </p>
          </motion.div>
        )}

        {parcel && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-8"
          >

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="font-display flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Parcel Details
                  </CardTitle>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      statusColors[currentStatus] ||
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {formattedStatus}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">

                  {/* Tracking Number */}
                  <div>
                    <span className="text-muted-foreground">
                      Tracking Number
                    </span>

                    <p className="font-semibold text-foreground mt-1">
                      {parcel.trackingNumber || "N/A"}
                    </p>
                  </div>

                  {/* Shipment Type */}
                  <div>
                    <span className="text-muted-foreground">
                      Shipment Type
                    </span>

                    <p className="font-medium text-foreground capitalize mt-1">
                      {parcel.shipmentType || "N/A"}
                    </p>
                  </div>

                  {/* Delivery Type */}
                  <div>
                    <span className="text-muted-foreground">
                      Delivery Type
                    </span>

                    <p className="font-medium text-foreground capitalize mt-1">
                      {parcel.deliveryType || "N/A"}
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <span className="text-muted-foreground">
                      Category
                    </span>

                    <p className="font-medium text-foreground capitalize mt-1">
                      {parcel.parcelCategory || "N/A"}
                    </p>
                  </div>

                  {/* Weight */}
                  <div>
                    <span className="text-muted-foreground">
                      Weight
                    </span>

                    <p className="font-medium text-foreground mt-1">
                      {parcel.weight != null
                        ? `${parcel.weight} kg`
                        : "N/A"}
                    </p>
                  </div>

                  {/* Origin */}
                  <div>
                    <span className="text-muted-foreground">
                      Origin
                    </span>

                    <p className="font-medium text-foreground capitalize mt-1">
                      {parcel.originCity || "N/A"}
                    </p>
                  </div>

                  {/* Destination */}
                  <div>
                    <span className="text-muted-foreground">
                      Destination
                    </span>

                    <p className="font-medium text-foreground capitalize mt-1">
                      {parcel.destinationCity || "N/A"}
                    </p>
                  </div>

                  {/* Current Status */}
                  <div>
                    <span className="text-muted-foreground">
                      Current Status
                    </span>

                    <p className="font-medium text-foreground capitalize mt-1">
                      {formattedStatus}
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Tracking Timeline
              </h3>

              {parcel.checkpoints?.length > 0 ? (
                <TrackingTimeline
                  checkpoints={parcel.checkpoints}
                />
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-sm text-muted-foreground">
                    No tracking updates are available yet.
                  </CardContent>
                </Card>
              )}
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackParcel;
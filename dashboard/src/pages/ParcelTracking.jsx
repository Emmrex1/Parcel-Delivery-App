import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrackingTimeline } from "@/components/TrackingTimeline";
import { StatusBadge } from "@/components/StatusBadge";
import { Search } from "lucide-react";
import { trackParcelThunk } from "@/features/parcels/parcelSlice";
const getParcelStatus = (parcel) => {
  const checkpoints = parcel?.checkpoints || [];
  if (!checkpoints.length) {
    return "arrived";
  }
  return checkpoints[checkpoints.length - 1].status || "arrived";
};
export default function ParcelTracking() {
  const dispatch = useDispatch();
  const { trackedParcel, trackLoading, trackError } = useSelector(
    (state) => state.parcels,
  );
  const [query, setQuery] = useState("");
  const handleSearch = async () => {
    const trackingNumber = query.trim();
    if (!trackingNumber) {
      return;
    }
    await dispatch(trackParcelThunk(trackingNumber));
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {" "}
      {/* Page Header */}{" "}
      <div className="text-center space-y-1">
        {" "}
        <h1 className="text-2xl font-bold"> Track Parcel </h1>{" "}
        <p className="text-sm text-muted-foreground">
          {" "}
          Enter a tracking number to view the current shipment status.{" "}
        </p>{" "}
      </div>{" "}
      {/* Search Card */}{" "}
      <Card className="border-0 shadow-md">
        {" "}
        <CardContent className="pt-6">
          {" "}
          <div className="flex flex-col sm:flex-row gap-2">
            {" "}
            <div className="relative flex-1">
              {" "}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />{" "}
              <Input
                className="pl-9"
                placeholder="Enter tracking number (e.g. RX-ABC-123456)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />{" "}
            </div>{" "}
            <Button
              onClick={handleSearch}
              disabled={trackLoading || !query.trim()}
            >
              {" "}
              {trackLoading ? "Tracking..." : "Track Parcel"}{" "}
            </Button>{" "}
          </div>{" "}
        </CardContent>{" "}
      </Card>{" "}
      {/* Error */}{" "}
      {trackError && (
        <Card className="border-destructive/30 bg-destructive/5">
          {" "}
          <CardContent className="py-4">
            {" "}
            <p className="text-center text-sm text-destructive">
              {" "}
              {trackError}{" "}
            </p>{" "}
          </CardContent>{" "}
        </Card>
      )}{" "}
      {/* Parcel Result */}{" "}
      {trackedParcel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {" "}
          <Card className="border-0 shadow-md">
            {" "}
            <CardHeader>
              {" "}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {" "}
                <div>
                  {" "}
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    Tracking Number{" "}
                  </p>{" "}
                  <CardTitle className="font-mono text-base">
                    {" "}
                    {trackedParcel.trackingNumber || "-"}{" "}
                  </CardTitle>{" "}
                </div>{" "}
                <StatusBadge status={getParcelStatus(trackedParcel)} />{" "}
              </div>{" "}
              <p className="text-sm text-muted-foreground">
                {" "}
                {trackedParcel.originCity || "-"} →{" "}
                {trackedParcel.destinationCity || "-"}{" "}
              </p>{" "}
            </CardHeader>{" "}
            <CardContent>
              {" "}
              <TrackingTimeline
                checkpoints={trackedParcel.checkpoints || []}
              />{" "}
            </CardContent>{" "}
          </Card>{" "}
        </motion.div>
      )}{" "}
    </motion.div>
  );
}

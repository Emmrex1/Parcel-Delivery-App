import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Eye,
  Filter,
  Package,
  Plus,
  RefreshCw,
  Search,
  Truck,
} from "lucide-react";

import { fetchParcelsThunk } from "@/features/parcels/parcelSlice";

import { StatusBadge } from "@/components/StatusBadge";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

//  Constants


const PER_PAGE = 10;

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All Statuses",
  },
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

const SHIPMENT_OPTIONS = [
  {
    value: "all",
    label: "All Shipments",
  },
  {
    value: "national",
    label: "National",
  },
  {
    value: "international",
    label: "International",
  },
];

//  Helpers

const getParcelStatus = (parcel) => {
  if (parcel?.status) {
    return parcel.status;
  }

  const checkpoints = parcel?.checkpoints || [];

  if (!checkpoints.length) {
    return "arrived";
  }

  return (
    checkpoints[checkpoints.length - 1]?.status ||
    "arrived"
  );
};

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatShipmentType = (type) => {
  if (!type) {
    return "-";
  }

  return type.charAt(0).toUpperCase() + type.slice(1);
};


//  Manage Parcels


export default function ManageParcels() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux
  
  const {
    items,
    meta,
    loading,
    error,
  } = useSelector((state) => state.parcels);

  //  Local State
  

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shipmentFilter, setShipmentFilter] =
    useState("all");

  const [page, setPage] = useState(1);

  //  Fetch Parcels
  
  const loadParcels = useCallback(() => {
    dispatch(
      fetchParcelsThunk({
        page,
        limit: PER_PAGE,
        search,
        status:
          statusFilter === "all"
            ? ""
            : statusFilter,
        shipmentType:
          shipmentFilter === "all"
            ? ""
            : shipmentFilter,
      }),
    );
  }, [
    dispatch,
    page,
    search,
    statusFilter,
    shipmentFilter,
  ]);

  //  Fetch Whenever Filters Change
  

  useEffect(() => {
    const timer = setTimeout(() => {
      loadParcels();
    }, 350);

    return () => clearTimeout(timer);
  }, [loadParcels]);

  //  Reset Page When Filters Change
 

  useEffect(() => {
    setPage(1);
  }, [
    search,
    statusFilter,
    shipmentFilter,
  ]);

  //  Pagination
  

  const totalPages = meta?.totalPages || 1;

  const totalItems = meta?.total || 0;

  const showingFrom =
    totalItems === 0
      ? 0
      : (page - 1) * PER_PAGE + 1;

  const showingTo = Math.min(
    page * PER_PAGE,
    totalItems,
  );

  //  Refresh
  

  const handleRefresh = () => {
    loadParcels();
  };

  // Render
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Manage Parcels
          </h1>

          <p className="text-sm text-muted-foreground">
            View, search, filter and manage your parcels.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh
          </Button>

          <Button
            onClick={() => navigate("/create-parcel")}
          >
            <Plus className="mr-2 h-4 w-4" />

            Create Parcel
          </Button>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* Filters */}

      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            {/* Search */}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by tracking number..."
                className="pl-9"
              />
            </div>

            {/* Status */}

            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full md:w-[190px]">
                <Filter className="mr-2 h-4 w-4" />

                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Shipment */}

            <Select
              value={shipmentFilter}
              onValueChange={setShipmentFilter}
            >
              <SelectTrigger className="w-full md:w-[190px]">
                <Truck className="mr-2 h-4 w-4" />

                <SelectValue placeholder="Shipment Type" />
              </SelectTrigger>

              <SelectContent>
                {SHIPMENT_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Parcel Table */}

      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                Parcels
              </CardTitle>

              <p className="mt-1 text-xs text-muted-foreground">
                {totalItems} parcel
                {totalItems === 1 ? "" : "s"} found
              </p>
            </div>

            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <Skeleton
                    key={index}
                    className="h-12 w-full"
                  />
                ),
              )}
            </div>
          ) : items?.length === 0 ? (
            <div className="py-14 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />

              <h3 className="mt-4 text-sm font-semibold">
                No parcels found
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        Tracking Number
                      </TableHead>

                      <TableHead className="hidden md:table-cell">
                        Sender
                      </TableHead>

                      <TableHead className="hidden md:table-cell">
                        Receiver
                      </TableHead>

                      <TableHead className="hidden lg:table-cell">
                        Shipment
                      </TableHead>

                      <TableHead className="hidden lg:table-cell">
                        Origin
                      </TableHead>

                      <TableHead className="hidden xl:table-cell">
                        Destination
                      </TableHead>

                      <TableHead>
                        Status
                      </TableHead>

                      <TableHead className="hidden sm:table-cell">
                        Date
                      </TableHead>

                      <TableHead className="text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {items.map((parcel) => {
                      const status =
                        getParcelStatus(parcel);

                      return (
                        <TableRow
                          key={parcel._id}
                        >
                          <TableCell className="font-medium">
                            {parcel.trackingNumber ||
                              "-"}
                          </TableCell>

                          <TableCell className="hidden md:table-cell">
                            {parcel.senderName || "-"}
                          </TableCell>

                          <TableCell className="hidden md:table-cell">
                            {parcel.receiverName || "-"}
                          </TableCell>

                          <TableCell className="hidden lg:table-cell">
                            {formatShipmentType(
                              parcel.shipmentType,
                            )}
                          </TableCell>

                          <TableCell className="hidden lg:table-cell">
                            {parcel.originCity || "-"}
                          </TableCell>

                          <TableCell className="hidden xl:table-cell">
                            {parcel.destinationCity ||
                              "-"}
                          </TableCell>

                          <TableCell>
                            <StatusBadge
                              status={status}
                            />
                          </TableCell>

                          <TableCell className="hidden sm:table-cell">
                            {formatDate(
                              parcel.createdAt,
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/parcel/${parcel._id}`,
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />

                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}

              <div className="mt-6 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {showingFrom}–{showingTo} of{" "}
                  {totalItems}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      page <= 1 || loading
                    }
                    onClick={() =>
                      setPage((current) =>
                        Math.max(1, current - 1),
                      )
                    }
                  >
                    Previous
                  </Button>

                  <span className="min-w-[80px] text-center text-sm">
                    Page {page} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      page >= totalPages ||
                      loading
                    }
                    onClick={() =>
                      setPage((current) =>
                        Math.min(
                          totalPages,
                          current + 1,
                        ),
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
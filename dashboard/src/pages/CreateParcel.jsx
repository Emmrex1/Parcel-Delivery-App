import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Copy,
  PackagePlus,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { createParcelThunk } from "@/features/parcels/parcelSlice";

import {
  getDestinationOptionsForShipmentType,
  isValidDestinationForShipmentType,
  NIGERIAN_CITY_OPTIONS,
} from "@/lib/locationData";

const categories = [
  "document",
  "electronics",
  "fragile",
  "clothing",
  "food",
  "medicine",
  "cosmetics",
  "books",
  "small_package",
  "large_package",
];

const initialForm = {
  senderName: "",
  senderPhone: "",
  senderAddress: "",
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  shipmentType: "national",
  originCity: "",
  destinationCity: "",
  deliveryType: "standard",
  parcelCategory: "small_package",
  weight: 1,
};

export default function CreateParcel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { createLoading } = useSelector((state) => state.parcels);

  const [form, setForm] = useState(initialForm);
  const [createdParcel, setCreatedParcel] = useState(null);

  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const destinationOptions = useMemo(
    () => getDestinationOptionsForShipmentType(form.shipmentType),
    [form.shipmentType],
  );

  const handleShipmentTypeChange = (value) => {
    setForm((current) => {
      const next = {
        ...current,
        shipmentType: value,
      };

      if (
        !isValidDestinationForShipmentType(
          value,
          next.destinationCity,
        )
      ) {
        next.destinationCity = "";
      }

      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.senderName.trim() ||
      !form.senderPhone.trim() ||
      !form.senderAddress.trim() ||
      !form.receiverName.trim() ||
      !form.receiverPhone.trim() ||
      !form.receiverAddress.trim() ||
      !form.originCity.trim() ||
      !form.destinationCity.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const weight = Number(form.weight);

    if (!Number.isFinite(weight) || weight <= 0) {
      toast.error("Parcel weight must be greater than 0 kg.");
      return;
    }

    if (
      !isValidDestinationForShipmentType(
        form.shipmentType,
        form.destinationCity,
      )
    ) {
      toast.error(
        "Please select a valid destination for the selected shipment type.",
      );
      return;
    }

    const payload = {
      ...form,
      weight,
    };

    const result = await dispatch(createParcelThunk(payload));

    if (createParcelThunk.fulfilled.match(result)) {
      const parcel = result.payload;

      setCreatedParcel(parcel);
      setForm(initialForm);

      if (parcel?.trackingNumber) {
        toast.success(
          `Parcel created successfully: ${parcel.trackingNumber}`,
        );
      } else {
        toast.success("Parcel created successfully.");
      }
    }
  };

  const copyTrackingNumber = async () => {
    if (!createdParcel?.trackingNumber) return;

    try {
      await navigator.clipboard.writeText(
        createdParcel.trackingNumber,
      );

      toast.success("Tracking number copied.");
    } catch {
      toast.error("Unable to copy tracking number.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <PackagePlus className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            Create New Parcel
          </h1>

          <p className="text-sm text-muted-foreground">
            Fill in the details to create a new shipment.
          </p>
        </div>
      </div>

      {/* Success Card */}
      {createdParcel?.trackingNumber && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-success/20 bg-success/5 shadow-md">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-success" />

                  <div>
                    <p className="font-semibold">
                      Parcel created successfully
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Your parcel tracking number is:
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-md bg-background px-3 py-1.5 font-mono text-sm font-bold">
                        {createdParcel.trackingNumber}
                      </span>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={copyTrackingNumber}
                        title="Copy tracking number"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/parcels")}
                >
                  View Parcels
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sender */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">
              Sender Information
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="senderName">
                Sender Name *
              </Label>

              <Input
                id="senderName"
                placeholder="Full name"
                value={form.senderName}
                onChange={(e) =>
                  update("senderName", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderPhone">
                Sender Phone *
              </Label>

              <Input
                id="senderPhone"
                type="tel"
                placeholder="08012345678"
                value={form.senderPhone}
                onChange={(e) =>
                  update("senderPhone", e.target.value)
                }
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="senderAddress">
                Sender Address *
              </Label>

              <Input
                id="senderAddress"
                placeholder="Street address"
                value={form.senderAddress}
                onChange={(e) =>
                  update("senderAddress", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Receiver */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">
              Receiver Information
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="receiverName">
                Receiver Name *
              </Label>

              <Input
                id="receiverName"
                placeholder="Full name"
                value={form.receiverName}
                onChange={(e) =>
                  update("receiverName", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiverPhone">
                Receiver Phone *
              </Label>

              <Input
                id="receiverPhone"
                type="tel"
                placeholder="08012345678"
                value={form.receiverPhone}
                onChange={(e) =>
                  update("receiverPhone", e.target.value)
                }
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="receiverAddress">
                Receiver Address *
              </Label>

              <Input
                id="receiverAddress"
                placeholder="Street address"
                value={form.receiverAddress}
                onChange={(e) =>
                  update("receiverAddress", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipment */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">
              Shipment Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Shipment Type */}
            <div className="space-y-2">
              <Label>Shipment Type *</Label>

              <Select
                value={form.shipmentType}
                onValueChange={handleShipmentTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipment type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="national">
                    National
                  </SelectItem>

                  <SelectItem value="international">
                    International
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Origin */}
            <div className="space-y-2">
              <Label>Origin City *</Label>

              <Select
                value={form.originCity}
                onValueChange={(value) =>
                  update("originCity", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select origin city" />
                </SelectTrigger>

                <SelectContent>
                  {NIGERIAN_CITY_OPTIONS.map((option) => (
                    <SelectItem
                      value={option.value}
                      key={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <Label>Destination *</Label>

              <Select
                value={form.destinationCity}
                onValueChange={(value) =>
                  update("destinationCity", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>

                <SelectContent>
                  {destinationOptions.map((option) => (
                    <SelectItem
                      value={option.value}
                      key={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Delivery Type */}
            <div className="space-y-2">
              <Label>Delivery Type *</Label>

              <Select
                value={form.deliveryType}
                onValueChange={(value) =>
                  update("deliveryType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="sameday">
                    Same Day
                  </SelectItem>

                  <SelectItem value="overnight">
                    Overnight
                  </SelectItem>

                  <SelectItem value="standard">
                    Standard
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Parcel Category *</Label>

              <Select
                value={form.parcelCategory}
                onValueChange={(value) =>
                  update("parcelCategory", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                    >
                      {category
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (letter) =>
                          letter.toUpperCase(),
                        )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight">
                Weight (kg) *
              </Label>

              <Input
                id="weight"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="e.g. 2.5"
                value={form.weight}
                onChange={(e) =>
                  update("weight", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto"
            disabled={createLoading}
          >
            {createLoading ? (
              "Creating Parcel..."
            ) : (
              <>
                <PackagePlus className="mr-2 h-4 w-4" />
                Create Parcel
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Package } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { calculateCostThunk } from "../store/slice/parcelSlice";

import {
  getDestinationOptionsForShipmentType,
  isValidDestinationForShipmentType,
  NIGERIAN_CITY_OPTIONS,
} from "@/lib/locationData";

const categories = [
  { value: "document", label: "Document" },
  { value: "electronics", label: "Electronics" },
  { value: "fragile", label: "Fragile" },
  { value: "clothing", label: "Clothing" },
  { value: "food", label: "Food" },
  { value: "medicine", label: "Medicine" },
  { value: "cosmetics", label: "Cosmetics" },
  { value: "books", label: "Books" },
  { value: "small_package", label: "Small Package" },
  { value: "large_package", label: "Large Package" },
];

const CalculateCostPage = () => {
  const [form, setForm] = useState({
    originCity: "",
    destinationCity: "",
    shipmentType: "national",
    parcelCategory: "",
    weight: 1,
    deliveryType: "standard",
  });

  const dispatch = useDispatch();
  const { costQuote: result, costLoading: loading } = useSelector(
    (state) => state.parcels,
  );

  const { toast } = useToast();

  const destinationOptions = useMemo(
    () => getDestinationOptionsForShipmentType(form.shipmentType),
    [form.shipmentType],
  );

  const handleCalculate = async () => {
    if (!form.originCity || !form.destinationCity || !form.parcelCategory) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        ...form,
        weight: Number(form.weight),
      };

      await dispatch(calculateCostThunk(payload)).unwrap();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not calculate cost. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-3xl md:text-4xl text-foreground font-bold">
              Calculate Shipping Cost
            </h1>
            <p className="mt-2 text-muted-foreground">
              Get an instant quote for your delivery
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Shipment Details
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Origin City</Label>
                      <Select
                        value={form.originCity}
                        onValueChange={(v) =>
                          setForm({ ...form, originCity: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>

                        <SelectContent>
                          {NIGERIAN_CITY_OPTIONS.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Destination City</Label>
                      <Select
                        value={form.destinationCity}
                        onValueChange={(v) =>
                          setForm({ ...form, destinationCity: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>

                        <SelectContent>
                          {destinationOptions.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Shipment Type</Label>
                    <Select
                      value={form.shipmentType}
                      onValueChange={(v) =>
                        setForm((f) => {
                          const next = { ...f, shipmentType: v };
                          if (
                            !isValidDestinationForShipmentType(
                              v,
                              next.destinationCity,
                            )
                          ) {
                            next.destinationCity = "";
                          }
                          return next;
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="international">
                          International
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Parcel Category</Label>
                    <Select
                      value={form.parcelCategory}
                      onValueChange={(v) =>
                        setForm({ ...form, parcelCategory: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>

                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Weight (kg)</Label>
                      <Input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={form.weight}
                        onChange={(e) =>
                          setForm({ ...form, weight: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Delivery Type</Label>
                      <Select
                        value={form.deliveryType}
                        onValueChange={(v) =>
                          setForm({ ...form, deliveryType: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="sameday">Same Day</SelectItem>
                          <SelectItem value="overnight">Overnight</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleCalculate}
                    disabled={loading}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                  >
                    {loading ? "Calculating..." : "Calculate Cost"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            > */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg mx-auto mt-10"
              >
                <Card className="overflow-hidden border-primary/20 shadow-lg">
                  <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Delivery Cost Estimate
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b pb-4">
                        <span className="text-sm text-muted-foreground">
                          Shipment Type
                        </span>

                        <span className="font-semibold capitalize">
                          {result.type || "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b pb-4">
                        <span className="text-sm text-muted-foreground">
                          Parcel Category
                        </span>

                        <span className="font-semibold capitalize">
                          {result.parcelCategory || "N/A"}
                        </span>
                      </div>

                      <div className="rounded-xl bg-primary/5 p-5 text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          Estimated Delivery Cost
                        </p>

                        <h2 className="text-4xl font-bold text-primary">
                          ₦{Number(result.price || 0).toLocaleString()}
                        </h2>
                      </div>

                      <p className="text-xs text-center text-muted-foreground">
                        Final pricing may vary based on delivery requirements.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalculateCostPage;

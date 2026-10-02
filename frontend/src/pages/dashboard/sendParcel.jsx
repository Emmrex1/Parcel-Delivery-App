import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Package,
  Calculator,
  User,
  Truck,
  Loader2,
  ShieldCheck,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  calculateCostThunk,
  createParcelThunk,
  clearCost,
} from "@/features/slice/parcelSlice";

const INITIAL_FORM = {
  senderName: "",
  senderPhone: "",
  senderAddress: "",

  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",

  originCity: "",
  destinationCity: "",
  destinationCountry: "",

  shipmentType: "national",
  deliveryType: "standard",
  parcelCategory: "document",

  weight: "",
};

const STEPS = [
  {
    number: 1,
    title: "People",
    description: "Sender & receiver",
  },
  {
    number: 2,
    title: "Shipment",
    description: "Package details",
  },
  {
    number: 3,
    title: "Review",
    description: "Confirm & send",
  },
];

const INTERNATIONAL_COUNTRIES = [
  { value: "Ghana", label: "Ghana" },
  { value: "Kenya", label: "Kenya" },
  { value: "South Africa", label: "South Africa" },
  { value: "Egypt", label: "Egypt" },
  { value: "Morocco", label: "Morocco" },

  { value: "United Kingdom", label: "United Kingdom" },
  { value: "France", label: "France" },
  { value: "Germany", label: "Germany" },
  { value: "Italy", label: "Italy" },
  { value: "Spain", label: "Spain" },
  { value: "Netherlands", label: "Netherlands" },
  { value: "Belgium", label: "Belgium" },

  { value: "United States", label: "United States" },
  { value: "Canada", label: "Canada" },

  { value: "Brazil", label: "Brazil" },
  { value: "Argentina", label: "Argentina" },
  { value: "Chile", label: "Chile" },

  { value: "China", label: "China" },
  { value: "India", label: "India" },
  { value: "Japan", label: "Japan" },
  { value: "Singapore", label: "Singapore" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "South Korea", label: "South Korea" },

  { value: "United Arab Emirates", label: "United Arab Emirates" },
  { value: "Saudi Arabia", label: "Saudi Arabia" },
  { value: "Qatar", label: "Qatar" },
  { value: "Israel", label: "Israel" },

  { value: "Australia", label: "Australia" },
  { value: "New Zealand", label: "New Zealand" },
];

const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatLabel = (value = "") => {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const SendParcel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { costQuote, costLoading, createLoading } = useSelector(
    (state) => state.parcels,
  );

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const price = useMemo(() => {
    return costQuote?.price ?? null;
  }, [costQuote]);

  const breakdown = costQuote?.breakdown;

  // INPUT HANDLER
  

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      if (name === "shipmentType" && value === "national") {
        updated.destinationCountry = "Nigeria";
      }

      if (name === "shipmentType" && value === "international") {
        updated.destinationCountry = "";
      }

      return updated;
    });

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      ...(name === "shipmentType" ? { destinationCountry: "" } : {}),
    }));

    if (
      [
        "originCity",
        "destinationCity",
        "destinationCountry",
        "shipmentType",
        "deliveryType",
        "parcelCategory",
        "weight",
      ].includes(name)
    ) {
      dispatch(clearCost());
    }
  };

  // VALIDATION
  
  const validateStepOne = () => {
    const newErrors = {};

    if (!form.senderName.trim()) {
      newErrors.senderName = "Sender name is required.";
    }

    if (!form.senderPhone.trim()) {
      newErrors.senderPhone = "Sender phone is required.";
    }

    if (!form.senderAddress.trim()) {
      newErrors.senderAddress = "Sender address is required.";
    }

    if (!form.receiverName.trim()) {
      newErrors.receiverName = "Receiver name is required.";
    }

    if (!form.receiverPhone.trim()) {
      newErrors.receiverPhone = "Receiver phone is required.";
    }

    if (!form.receiverAddress.trim()) {
      newErrors.receiverAddress = "Receiver address is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors = {};

    if (!form.originCity.trim()) {
      newErrors.originCity = "Origin city is required.";
    }

    if (!form.destinationCity.trim()) {
      newErrors.destinationCity = "Destination city is required.";
    }

    if (
      form.shipmentType === "international" &&
      !form.destinationCountry.trim()
    ) {
      newErrors.destinationCountry = "Destination country is required.";
    }

    if (!form.weight || Number(form.weight) <= 0) {
      newErrors.weight = "Please enter a valid weight greater than 0.";
    } else if (Number(form.weight) > 70) {
      newErrors.weight = "Shipments above 70kg require a custom freight quote.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  //  STEP NAVIGATIO

  const handleNext = async () => {
    if (step === 1) {
      if (!validateStepOne()) return;

      setStep(2);
      return;
    }

    if (step === 2) {
      if (!validateStepTwo()) return;

      const destinationCountry =
        form.shipmentType === "national"
          ? "Nigeria"
          : form.destinationCountry.trim();

      const result = await dispatch(
        calculateCostThunk({
          originCity: form.originCity.trim(),
          destinationCity: form.destinationCity.trim(),
          destinationCountry,
          shipmentType: form.shipmentType,
          deliveryType: form.deliveryType,
          parcelCategory: form.parcelCategory,
          weight: Number(form.weight),
        }),
      );

      if (calculateCostThunk.fulfilled.match(result)) {
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((previous) => previous - 1);
    }
  };

  // CREATE SHIPMENT

  const handleCreateShipment = async () => {
    if (!costQuote?.price) {
      return;
    }

    const destinationCountry =
      form.shipmentType === "national"
        ? "Nigeria"
        : form.destinationCountry.trim();

    const result = await dispatch(
      createParcelThunk({
        senderName: form.senderName.trim(),
        senderPhone: form.senderPhone.trim(),
        senderAddress: form.senderAddress.trim(),

        receiverName: form.receiverName.trim(),
        receiverPhone: form.receiverPhone.trim(),
        receiverAddress: form.receiverAddress.trim(),

        originCity: form.originCity.trim(),
        destinationCity: form.destinationCity.trim(),
        destinationCountry,

        shipmentType: form.shipmentType,
        deliveryType: form.deliveryType,
        parcelCategory: form.parcelCategory,

        weight: Number(form.weight),
      }),
    );

    if (createParcelThunk.fulfilled.match(result)) {
      const parcel = result.payload?.parcel;

      if (parcel?._id) {
        navigate(`/my-shipments/${parcel._id}`);
      } else {
        navigate("/my-shipments");
      }
    }
  };

  // STEP 1

  const renderStepOne = () => {
    return (
      <div className="space-y-8">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Sender information</h2>

              <p className="text-sm text-muted-foreground">
                Enter the person sending the parcel.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="senderName">Full name</Label>

              <Input
                id="senderName"
                name="senderName"
                value={form.senderName}
                onChange={handleChange}
                placeholder="John Doe"
              />

              {errors.senderName && (
                <p className="text-sm text-destructive">{errors.senderName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderPhone">Phone number</Label>

              <Input
                id="senderPhone"
                name="senderPhone"
                value={form.senderPhone}
                onChange={handleChange}
                placeholder="08012345678"
              />

              {errors.senderPhone && (
                <p className="text-sm text-destructive">{errors.senderPhone}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="senderAddress">Pickup address</Label>

              <Input
                id="senderAddress"
                name="senderAddress"
                value={form.senderAddress}
                onChange={handleChange}
                placeholder="15 Allen Avenue, Ikeja, Lagos"
              />

              {errors.senderAddress && (
                <p className="text-sm text-destructive">
                  {errors.senderAddress}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Receiver information</h2>

              <p className="text-sm text-muted-foreground">
                Enter the person receiving the parcel.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="receiverName">Full name</Label>

              <Input
                id="receiverName"
                name="receiverName"
                value={form.receiverName}
                onChange={handleChange}
                placeholder="Jane Doe"
              />

              {errors.receiverName && (
                <p className="text-sm text-destructive">
                  {errors.receiverName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiverPhone">Phone number</Label>

              <Input
                id="receiverPhone"
                name="receiverPhone"
                value={form.receiverPhone}
                onChange={handleChange}
                placeholder="08087654321"
              />

              {errors.receiverPhone && (
                <p className="text-sm text-destructive">
                  {errors.receiverPhone}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="receiverAddress">Delivery address</Label>

              <Input
                id="receiverAddress"
                name="receiverAddress"
                value={form.receiverAddress}
                onChange={handleChange}
                placeholder="24 Garki Area 11, Abuja"
              />

              {errors.receiverAddress && (
                <p className="text-sm text-destructive">
                  {errors.receiverAddress}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // STEP 2

  const renderStepTwo = () => {
    return (
      <div className="space-y-8">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Shipment details</h2>

              <p className="text-sm text-muted-foreground">
                Tell us about the parcel you're sending.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Shipment type */}
            <div className="space-y-2">
              <Label htmlFor="shipmentType">Shipment type</Label>

              <select
                id="shipmentType"
                name="shipmentType"
                value={form.shipmentType}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="national">National</option>

                <option value="international">International</option>
              </select>
            </div>

            {/* Origin city */}
            <div className="space-y-2">
              <Label htmlFor="originCity">Origin city</Label>

              <Input
                id="originCity"
                name="originCity"
                value={form.originCity}
                onChange={handleChange}
                placeholder="Lagos"
              />

              {errors.originCity && (
                <p className="text-sm text-destructive">{errors.originCity}</p>
              )}
            </div>

            {/* Destination country - international only */}
            {form.shipmentType === "international" && (
              <div className="space-y-2">
                <Label htmlFor="destinationCountry">Destination country</Label>

                <div className="relative">
                  <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <select
                    id="destinationCountry"
                    name="destinationCountry"
                    value={form.destinationCountry}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm"
                  >
                    <option value="">Select destination country</option>

                    {INTERNATIONAL_COUNTRIES.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.destinationCountry && (
                  <p className="text-sm text-destructive">
                    {errors.destinationCountry}
                  </p>
                )}
              </div>
            )}

            {/* Destination city */}
            <div className="space-y-2">
              <Label htmlFor="destinationCity">Destination city</Label>

              <Input
                id="destinationCity"
                name="destinationCity"
                value={form.destinationCity}
                onChange={handleChange}
                placeholder={
                  form.shipmentType === "international" ? "London" : "Abuja"
                }
              />

              {errors.destinationCity && (
                <p className="text-sm text-destructive">
                  {errors.destinationCity}
                </p>
              )}
            </div>

            {/* Delivery speed */}
            <div className="space-y-2">
              <Label htmlFor="deliveryType">Delivery speed</Label>

              <select
                id="deliveryType"
                name="deliveryType"
                value={form.deliveryType}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="standard">Standard</option>

                <option value="overnight">Overnight</option>

                <option value="sameday">Same Day</option>
              </select>
            </div>

            {/* Parcel category */}
            <div className="space-y-2">
              <Label htmlFor="parcelCategory">Parcel category</Label>

              <select
                id="parcelCategory"
                name="parcelCategory"
                value={form.parcelCategory}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="document">Document</option>

                <option value="electronics">Electronics</option>

                <option value="clothing">Clothing</option>

                <option value="fragile">Fragile</option>

                <option value="food">Food</option>

                <option value="medicine">Medicine</option>

                <option value="cosmetics">Cosmetics</option>

                <option value="books">Books</option>

                <option value="small_package">Small Package</option>

                <option value="large_package">Large Package</option>
              </select>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>

              <Input
                id="weight"
                name="weight"
                type="number"
                min="0.1"
                max="70"
                step="0.1"
                value={form.weight}
                onChange={handleChange}
                placeholder="e.g. 2.5"
              />

              <p className="text-xs text-muted-foreground">
                Maximum parcel weight: 70 kg
              </p>

              {errors.weight && (
                <p className="text-sm text-destructive">{errors.weight}</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-muted/30 p-5">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div>
              <p className="font-medium">
                Pricing is calculated before shipment creation
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                We'll calculate your delivery cost based on the route,
                destination region, weight, delivery speed and parcel handling
                requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // STEP 3

  const renderStepThree = () => {
    return (
      <div className="space-y-8">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Calculator className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Review shipment</h2>

              <p className="text-sm text-muted-foreground">
                Confirm the details before creating your shipment.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Shipment summary */}
          <div className="rounded-2xl border p-6">
            <h3 className="mb-5 font-semibold">Shipment information</h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Shipment type</span>

                <span className="font-medium">
                  {formatLabel(form.shipmentType)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Sender</span>

                <span className="font-medium text-right">
                  {form.senderName}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Receiver</span>

                <span className="font-medium text-right">
                  {form.receiverName}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Origin</span>

                <span className="font-medium text-right">
                  {form.originCity}, Nigeria
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Destination</span>

                <span className="font-medium text-right">
                  {form.destinationCity},{" "}
                  {form.shipmentType === "national"
                    ? "Nigeria"
                    : form.destinationCountry}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Category</span>

                <span className="font-medium">
                  {formatLabel(form.parcelCategory)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Weight</span>

                <span className="font-medium">{form.weight} kg</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Delivery</span>

                <span className="font-medium">
                  {formatLabel(form.deliveryType)}
                </span>
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="mb-5 font-semibold">Delivery cost</h3>

            {costLoading ? (
              <div className="flex min-h-[220px] items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            ) : costQuote ? (
              <div className="space-y-5">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      {formatLabel(
                        breakdown?.zone || breakdown?.destinationZone,
                      )}
                    </span>

                    <span>{formatCurrency(breakdown?.zoneCharge)}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      Weight ({breakdown?.weightBand})
                    </span>

                    <span>{formatCurrency(breakdown?.weightCharge)}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      {formatLabel(breakdown?.deliveryType)} delivery
                    </span>

                    <span>{formatCurrency(breakdown?.deliveryTypeCharge)}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Handling</span>

                    <span>{formatCurrency(breakdown?.handlingCharge)}</span>
                  </div>
                </div>

                <div className="border-t pt-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total delivery cost
                      </p>

                      <p className="mt-1 text-3xl font-bold">
                        {formatCurrency(price)}
                      </p>
                    </div>

                    <Truck className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {breakdown?.customsAndTaxes && (
                  <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                    Customs and taxes are not included in this delivery
                    estimate.
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No delivery quote available.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // PAGE

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Send a Parcel</h1>

          <p className="mt-2 text-muted-foreground">
            Create a shipment and get your delivery cost before sending.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 rounded-2xl border bg-card p-5">
          <div className="grid grid-cols-3 gap-3">
            {STEPS.map((item) => {
              const active = step === item.number;
              const completed = step > item.number;

              return (
                <div key={item.number} className="flex items-center gap-3">
                  <div
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                      completed || active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {completed ? <Check className="h-4 w-4" /> : item.number}
                  </div>

                  <div className="hidden sm:block">
                    <p
                      className={[
                        "text-sm font-medium",
                        active ? "text-foreground" : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {item.title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main card */}
        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="p-6 sm:p-8">
            {step === 1 && renderStepOne()}
            {step === 2 && renderStepTwo()}
            {step === 3 && renderStepThree()}
          </div>

          {/* Footer actions */}
          <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || createLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {step < 3 ? (
              <Button type="button" onClick={handleNext} disabled={costLoading}>
                {step === 2 ? (
                  <>
                    <Calculator className="mr-2 h-4 w-4" />
                    {costLoading ? "Calculating..." : "Calculate Cost"}
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleCreateShipment}
                disabled={createLoading || !costQuote?.price}
              >
                {createLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Shipment...
                  </>
                ) : (
                  <>
                    <Truck className="mr-2 h-4 w-4" />
                    Create Shipment
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendParcel;

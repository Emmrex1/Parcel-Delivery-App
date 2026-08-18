// Delivery type charges
const DELIVERY_TYPE_CHARGES = {
  sameday: 150,
  overnight: 80,
  standard: 0,
};

// National shipment category adjustments
const NATIONAL_CATEGORY_CHARGES = {
  document: -100,
  electronics: 150,
  fragile: 250,
  clothing: 0,
  food: 120,
  medicine: 150,
  cosmetics: 100,
  books: -20,
  small_package: 100,
  large_package: 250,
};

// International shipment category adjustments
const INTERNATIONAL_CATEGORY_CHARGES = {
  document: 700,
  electronics: 2000,
  fragile: 3500,
  clothing: 500,
  food: 1500,
  medicine: 1800,
  cosmetics: 1000,
  books: 300,
  small_package: 800,
  large_package: 2000,
};


// Calculate parcel delivery cost
export const calculateCost = ({
  originCity,
  destinationCity,
  shipmentType,
  deliveryType,
  parcelCategory,
  weight,
}) => {
  // Check if origin and destination are the same city
  const isSameCity =
    originCity.trim().toLowerCase() ===
    destinationCity.trim().toLowerCase();

  // Get delivery type charge
  const deliveryTypeCharge =
    DELIVERY_TYPE_CHARGES[deliveryType] || 0;


  // ==========================================
  // NATIONAL SHIPMENT
  // ==========================================
  if (shipmentType === "national") {
    const categoryCharge =
      NATIONAL_CATEGORY_CHARGES[parcelCategory] || 0;

    // Same-city national shipment
    if (isSameCity) {
      const basePrice = 50;
      const weightPrice = weight * 500;

      const price =
        basePrice +
        weightPrice +
        deliveryTypeCharge +
        categoryCharge;

      return {
        type: "national",
        parcelCategory,
        price,
      };
    }

    // Different-city national shipment
    const basePrice = 100;
    const weightPrice = weight * 500;

    const price =
      basePrice +
      weightPrice +
      deliveryTypeCharge +
      categoryCharge;

    return {
      type: "national",
      parcelCategory,
      price,
    };
  }


  // ==========================================
  // INTERNATIONAL SHIPMENT
  // ==========================================
  if (shipmentType === "international") {
    const categoryCharge =
      INTERNATIONAL_CATEGORY_CHARGES[parcelCategory] || 0;

    // Validate weight
    if (weight <= 0) {
      throw new Error("Weight must be greater than 0.");
    }

    let price;

    // Up to 0.5kg
    if (weight <= 0.5) {
      price = 7500;

    // More than 0.5kg up to 1kg
    } else if (weight <= 1) {
      price = 13500;

    // More than 1kg
    } else {
      const extraKg = Math.ceil(weight - 1);

      price = 13500 + extraKg * 7500;
    }

    // Add category charge
    price += categoryCharge;

    return {
      type: "international",
      parcelCategory,
      price,
    };
  }


  // Invalid shipment type
  throw new Error(
    "Invalid shipment type configuration. Must be 'national' or 'international'."
  );
};
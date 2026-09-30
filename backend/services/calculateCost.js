const DELIVERY_TYPE_CHARGES = {
  sameday: 1500,
  overnight: 800,
  standard: 0,
};

// NATIONAL DELIVERY ZONES

const NATIONAL_ZONE_CHARGES = {
  same_city: 1000,
  same_zone: 2000,
  adjacent_zone: 3000,
  long_distance: 4500,
};

// NATIONAL WEIGHT CHARGES

const NATIONAL_WEIGHT_CHARGES = {
  up_to_1kg: 0,
  up_to_5kg: 1000,
  up_to_10kg: 2500,
  up_to_25kg: 5000,
  up_to_50kg: 8500,
  up_to_70kg: 12000,
};

// NATIONAL SPECIAL HANDLING CHARGES

const NATIONAL_HANDLING_CHARGES = {
  document: 0,
  electronics: 300,
  fragile: 500,
  clothing: 0,
  food: 300,
  medicine: 500,
  cosmetics: 200,
  books: 0,
  small_package: 200,
  large_package: 700,
};

// INTERNATIONAL DESTINATION ZONES

const INTERNATIONAL_ZONE_CHARGES = {
  africa: 15000,
  europe: 30000,
  north_america: 40000,
  south_america: 45000,
  asia: 35000,
  middle_east: 30000,
  oceania: 45000,
};

// INTERNATIONAL SPECIAL HANDLING

const INTERNATIONAL_HANDLING_CHARGES = {
  document: 0,
  electronics: 3000,
  fragile: 5000,
  clothing: 1000,
  food: 3000,
  medicine: 4000,
  cosmetics: 2000,
  books: 500,
  small_package: 1500,
  large_package: 5000,
};


// CITY → ZONE MAPPING

const CITY_ZONES = {
  // South West
  lagos: "south_west",
  ibadan: "south_west",
  abeokuta: "south_west",
  akure: "south_west",
  osogbo: "south_west",
  ado_ekiti: "south_west",

  // South South
  benin: "south_south",
  benin_city: "south_south",
  warri: "south_south",
  port_harcourt: "south_south",
  uyo: "south_south",
  calabar: "south_south",
  yenagoa: "south_south",
  asaba: "south_south",

  // South East
  enugu: "south_east",
  onitsha: "south_east",
  owerri: "south_east",
  aba: "south_east",
  umuahia: "south_east",
  awka: "south_east",

  // North Central
  abuja: "north_central",
  minna: "north_central",
  lokoja: "north_central",
  ilorin: "north_central",
  jos: "north_central",
  makurdi: "north_central",

  // North West
  kano: "north_west",
  kaduna: "north_west",
  katsina: "north_west",
  sokoto: "north_west",
  kebbi: "north_west",
  zamfara: "north_west",

  // North East
  maiduguri: "north_east",
  yola: "north_east",
  bauchi: "north_east",
  gombe: "north_east",
  jalingo: "north_east",
};

// NORMALIZE CITY NAME

const normalizeCity = (city) => {
  return city
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
};

// DETERMINE NATIONAL DELIVERY ZONE

const getNationalDeliveryZone = (
  originCity,
  destinationCity
) => {
  const origin = normalizeCity(originCity);
  const destination = normalizeCity(destinationCity);

  if (origin === destination) {
    return "same_city";
  }

  const originZone = CITY_ZONES[origin];
  const destinationZone = CITY_ZONES[destination];

  // Unknown cities are treated as long-distance.
  if (!originZone || !destinationZone) {
    return "long_distance";
  }

  // Same geographical region
  if (originZone === destinationZone) {
    return "same_zone";
  }

  return "long_distance";
};

// NATIONAL WEIGHT CALCULATION

const calculateNationalWeightCharge = (weight) => {
  if (weight <= 1) {
    return {
      band: "0-1kg",
      charge: NATIONAL_WEIGHT_CHARGES.up_to_1kg,
    };
  }

  if (weight <= 5) {
    return {
      band: "1-5kg",
      charge: NATIONAL_WEIGHT_CHARGES.up_to_5kg,
    };
  }

  if (weight <= 10) {
    return {
      band: "5-10kg",
      charge: NATIONAL_WEIGHT_CHARGES.up_to_10kg,
    };
  }

  if (weight <= 25) {
    return {
      band: "10-25kg",
      charge: NATIONAL_WEIGHT_CHARGES.up_to_25kg,
    };
  }

  if (weight <= 50) {
    return {
      band: "25-50kg",
      charge: NATIONAL_WEIGHT_CHARGES.up_to_50kg,
    };
  }

  if (weight <= 70) {
    return {
      band: "50-70kg",
      charge: NATIONAL_WEIGHT_CHARGES.up_to_70kg,
    };
  }

  throw new Error(
    "Shipments above 70kg require a custom freight quote."
  );
};


// INTERNATIONAL WEIGHT CALCULATION

const calculateInternationalWeight = (weight) => {
  if (weight <= 0.5) {
    return {
      band: "0-0.5kg",
      charge: 7500,
    };
  }

  if (weight <= 1) {
    return {
      band: "0.5-1kg",
      charge: 13500,
    };
  }

  const extraKg = Math.ceil(weight - 1);

  return {
    band: `${weight}kg+`,
    charge: 13500 + extraKg * 7500,
  };
};

// MAIN CALCULATOR

export const calculateCost = ({
  originCity,
  destinationCity,
  shipmentType,
  deliveryType,
  parcelCategory,
  weight,
}) => {
  
  // VALIDATION
  
  if (!originCity || !destinationCity) {
    throw new Error(
      "Origin city and destination city are required."
    );
  }

  if (!shipmentType) {
    throw new Error("Shipment type is required.");
  }

  if (!deliveryType) {
    throw new Error("Delivery type is required.");
  }

  if (!parcelCategory) {
    throw new Error("Parcel category is required.");
  }

  if (!weight || weight <= 0) {
    throw new Error("Weight must be greater than 0.");
  }

  // DELIVERY TYPE

  const deliveryTypeCharge =
    DELIVERY_TYPE_CHARGES[deliveryType];

  if (deliveryTypeCharge === undefined) {
    throw new Error("Invalid delivery type.");
  }

  // NATIONAL SHIPMENT

  if (shipmentType === "national") {
    const deliveryZone = getNationalDeliveryZone(
      originCity,
      destinationCity
    );

    const zoneCharge =
      NATIONAL_ZONE_CHARGES[deliveryZone];

    const weightInfo =
      calculateNationalWeightCharge(weight);

    const handlingCharge =
      NATIONAL_HANDLING_CHARGES[parcelCategory];

    if (handlingCharge === undefined) {
      throw new Error(
        "Invalid parcel category for national shipment."
      );
    }

    const price =
      zoneCharge +
      weightInfo.charge +
      deliveryTypeCharge +
      handlingCharge;

    return {
      type: "national",

      originCity,
      destinationCity,

      parcelCategory,

      weight,

      currency: "NGN",

      price,

      breakdown: {
        zone: deliveryZone,
        zoneCharge,

        weightBand: weightInfo.band,
        weightCharge: weightInfo.charge,

        deliveryType,
        deliveryTypeCharge,

        handlingCharge,
      },
    };
  }

  // INTERNATIONAL SHIPMENT

  if (shipmentType === "international") {
    const weightInfo =
      calculateInternationalWeight(weight);

    const handlingCharge =
      INTERNATIONAL_HANDLING_CHARGES[parcelCategory];

    if (handlingCharge === undefined) {
      throw new Error(
        "Invalid parcel category for international shipment."
      );
    }

    const destinationZone = "africa";

    const zoneCharge =
      INTERNATIONAL_ZONE_CHARGES[destinationZone];

    const price =
      zoneCharge +
      weightInfo.charge +
      deliveryTypeCharge +
      handlingCharge;

    return {
      type: "international",

      originCity,
      destinationCity,

      parcelCategory,

      weight,

      currency: "NGN",

      price,

      breakdown: {
        destinationZone,
        zoneCharge,

        weightBand: weightInfo.band,
        weightCharge: weightInfo.charge,

        deliveryType,
        deliveryTypeCharge,

        handlingCharge,

        customsAndTaxes: "Not included",
      },
    };
  }

  //  INVALID SHIPMENT TYPE
  
  throw new Error(
    "Invalid shipment type. Must be 'national' or 'international'."
  );
};
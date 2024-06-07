export enum PackageTypeEnum {
  Electronic = 'Electronics',
  Food = 'Food',
  Cloths = 'Cloths',
  Jewelry = 'Jewelry',
  Document = 'Documents',
  Glass = 'Glass',
}

export enum shippingCategoryEnum {
  Road = 'Road',
  Air = 'Air',
  Water = 'Water',
  Train = 'Train',
}

export enum ModeOfShippingEnum {
Car = 'Car',
Bike = 'Bike',
Truck = 'Truck',
Bus = 'Bus',
GeneralCargo = 'General Cargo',
SpecialCargo = 'Special Cargo',
PerishableCargo = 'Persihable Cargo',
MailCargo = 'Mail Cargo',
Commercial = 'Commercial',
PrivateVessels = 'Private Vessels',
BulkCargo = 'Bulk Cargo',
Containerization = 'Containerization',
}

// export enum ModeOfShippingEnum {
//   Road = ' Road (Car, Bike, Truck, Bus)',
//   Air = 'Air (General Cargo, Special Cargo, Perishable Cargo, Mail Cargo)',
//   Water = 'Water (Commercial, Private Vessels)',
//   Train = 'Train (Bulk Cargo, Containerization, Special Cargo)',
// }

export enum InsuranceTypeEnum {
  GeneralLiability = ' General Liability ',
  PhysicalDamage = 'Physical Damage',
  OpenCover = 'Open Cover ',
  ExcessLiability = 'Excess Liability ',
}

export enum ShipmentStatusEnum {
  Initiated = 'Initiated',
  Cancelled = 'Cancelled',
  Paid = 'Paid',
  PaymentFailed = 'Payment Failed',
  OnTheMove = 'On The Move',
}

export enum ShipmentTypeEnum{
  BookLater = 'Book Later',
  InstantShipping = 'Instant Shipping',
}

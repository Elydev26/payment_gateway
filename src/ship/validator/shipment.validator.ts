import * as Joi from 'joi';
import { CountryEnum } from 'src/utils/enums/country.enum';
import { LocalGovernmentsEnum } from 'src/utils/enums/localgovernmentEnums/index.enum';
import { StateEnum } from 'src/utils/enums/stateEnums/index.enum';
import { emailValidator } from 'src/utils/validators/email.validator';
import { InsuranceTypeEnum, ModeOfShippingEnum, PackageTypeEnum, ShipmentTypeEnum, shippingCategoryEnum } from '../enum/ship.enum';
import { PackageDimensionsSchema } from '../schema/packageDimensions.schema';
import { dateOfBirthValidator } from 'src/utils/validators/date.validator';


export const createShipmentValidator = Joi.object({
  sender: Joi.object({
    name: Joi.string().trim().required().messages({
     'string.base': `"sender's name" should be a type of 'text'`,
    'any.required': `"sender's name" is a required field`,
    }),
    email: emailValidator.required().messages({
        'any.required': `"email" is a required field`,
    }),
    address: Joi.string().trim().required().messages({
        'string.base': `"address" should be a type of 'text'`,
        'any.required': `"address" is a required field`,
      }),
    phoneNumber:Joi.string().trim().required(),
    state: Joi.string()
    .valid(...Object.values(StateEnum))
    .required()
    .messages({
      'string.base': `"state" should be a type of 'text'`,
      'any.only':
        'value {:[.]} on line {{#label}} is not a valid value, please supply a valid value',
    }),
    localGovernment: Joi.string()
    .valid(...Object.values(LocalGovernmentsEnum))
    .required()
    .messages({
      'string.base': `"localGovernment" should be a type of 'text'`,
      'any.required': `"localGovernment" is a required field`,
      'any.only':
        'value {:[.]} on line {{#label}} is not a valid value, please supply a valid value',
    }),
    country: Joi.string()
    .valid(...Object.values(CountryEnum))
    .required()
    .messages({
      'string.base': `"country" should be a type of 'text'`,
      'any.only':
        'value {:[.]} on line {{#label}} is not a valid value, please supply a valid value',
    }),
  }),
  receiver: Joi.object({
    name: Joi.string().trim().required().messages({
     'string.base': `"receiver's name" should be a type of 'text'`,
    'any.required': `"receiver's name" is a required field`,
    }),
    email: emailValidator.required().messages({
        'any.required': `"email" is a required field`,
    }),
    address: Joi.string().trim().required().messages({
        'string.base': `"address" should be a type of 'text'`,
        'any.required': `"address" is a required field`,
      }),
    phoneNumber:Joi.string().trim().required(),
    state: Joi.string()
    .valid(...Object.values(StateEnum))
    .required()
    .messages({
      'string.base': `"state" should be a type of 'text'`,
      'any.only':
        'value {:[.]} on line {{#label}} is not a valid value, please supply a valid value',
    }),
    localGovernment: Joi.string()
    .valid(...Object.values(LocalGovernmentsEnum))
    .required()
    .messages({
      'string.base': `"localGovernment" should be a type of 'text'`,
      'any.required': `"localGovernment" is a required field`,
      'any.only':
        'value {:[.]} on line {{#label}} is not a valid value, please supply a valid value',
    }),
    country: Joi.string()
    .valid(...Object.values(CountryEnum))
    .required()
    .messages({
      'string.base': `"country" should be a type of 'text'`,
      'any.only':
        'value {:[.]} on line {{#label}} is not a valid value, please supply a valid value',
    }),
  }),
  quantity:Joi.number().required().messages({
    'any.required': 'quantity is a required field'
  }),
  modeOfShipping:Joi.string()
  .valid(...Object.values(ModeOfShippingEnum))
  .required()
  .messages({
    'string.base': `"mode of shipping" should be a type of 'text'`,
    'any.required': `"mode of shipping" is a required field`,
    'any.only':
      'value {:[.]} on line {{#label}} is not a valid value, please supply a valid value',
  }),
  insuranceType:Joi.string()
  .valid(...Object.values(InsuranceTypeEnum))
  .messages({
    'string.base': `"insurance type" should be a type of 'text'`,
    'any.only':
      'value {:[.]} on line {{#label}} is not a valid value, please supply a valid value',
  }),
  packageName:Joi.string().trim().required().messages({
    'string.base': `"package name" should be a type of 'text'`,
    'any.required': `"package name" is a required field`,
  }),
  packageDimensions:Joi.object({
    length:Joi.number().required().messages({
        'any.required': 'length is a required field'
      }),
      width:Joi.number().required().messages({
        'any.required': 'width is a required field'
      }),
      height:Joi.number().required().messages({
        'any.required': 'height is a required field'
      }),
  }),
  packageType:Joi.string()
  .valid(...Object.values(PackageTypeEnum))
  .messages({
    'string.base': `"package type" should be a type of 'text'`,
    'any.only':
      'value {:[.]} on line {{#label}} is not a valid value, please supply a valid value',
  }),
  packageWeight:Joi.number().required().messages({
    'any.required': 'package weight is a required field'
  }),
  packageImage:Joi.string().trim().required().messages({
    'any.required':`"package image" is a required field`
  }),
  expressDelivery:Joi.boolean().default(false),
  shippingCategory:Joi.string()
  .valid(...Object.values(shippingCategoryEnum))
  .messages({
    'string.base': `"shipping category" should be a type of 'text'`,
    'any.only':
      'value {:[.]} on line {{#label}} is not a valid value, please supply a valid value',
  }),
  additionalInformation:Joi.string().messages({
    'string.base': `"additional information" should be a type of 'text'`
  }),
  pickUpByNitrals:Joi.boolean().default(false),
  dropOffByYou:Joi.boolean().default(false),
  pickUpDropOffDate:Joi.date().required().messages({
    'date.base': `"pickup or dropoff date" should be a valid date`,
    'any.required': `"date" is a required field`,
  }),
  shipmentType:Joi.string()
  .valid(...Object.values(ShipmentTypeEnum))
  .messages({
    'string.base': `"shipment type" should be a type of 'text'`,
    'any.only':
      'value {:[.]} on line {{#label}} is not a valid value, please supply a valid value',
  }),
  shipmentDate: Joi.date()
    .when('shipmentType', {
      is: ShipmentTypeEnum.BookLater,
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'date.base': `"shipment date" should be a valid date`,
      'any.required': `"shipment date" is a required field'`,
    }),
  deliveryDate: Joi.date()
    .when('shipmentType', {
      is: ShipmentTypeEnum.BookLater,
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'date.base': `"delivery date" should be a valid date`,
      'any.required': `"delivery date" is a required field`,
    })
});
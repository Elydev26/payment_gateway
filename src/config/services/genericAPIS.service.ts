import { Injectable } from '@nestjs/common';
import { AccountStatusEnum } from 'src/utils/enums/accountStatus.enum';
import { CountryEnum } from 'src/utils/enums/country.enum';
import { Currency } from 'src/utils/enums/currency.enum';
import { PhoneCountryCodeEnum } from 'src/utils/enums/phoneCountryCodes.enum';

@Injectable()
export class GenericAPIsService {
  getAllEnumsValues() {
    return {
      accountStatusEnum: Object.values(AccountStatusEnum),
      countryCodeAbvENum: Object.values(CountryEnum),
      currency: Object.values(Currency),
      countryEnum: Object.values(CountryEnum),
      phoneCountryCodeEnum: Object.values(PhoneCountryCodeEnum),
    };
  }
}

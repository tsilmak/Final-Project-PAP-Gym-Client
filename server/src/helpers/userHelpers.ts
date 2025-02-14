import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Function to generate a unique membership number
export async function generateMembershipNumber(): Promise<string> {
  const yearPrefix = new Date().getFullYear().toString().slice(-2);
  let uniqueNumber: string;

  do {
    uniqueNumber = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
  } while (
    await prisma.user.findUnique({
      where: {
        membershipNumber: `${yearPrefix}${uniqueNumber}`,
      },
    })
  );

  return `${yearPrefix}${uniqueNumber}`;
}

// Function to fetch country top-level domains (TLDs)
export const fetchCountryTlds = async (): Promise<string[]> => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=tld"
    );
    const data: { tld: string[] }[] = await response.json();
    return data.map((country) => country.tld[0]?.replace(".", "") || "");
  } catch (error) {
    console.error("Error fetching country TLDs:", error);
    throw new Error("Unable to fetch country TLDs");
  }
};

// Function to fetch city data from Zippopotam API
export const fetchCityData = async (countryTld: string, zipcode: string) => {
  try {
    const response = await fetch(
      `https://api.zippopotam.us/${countryTld}/${zipcode}`
    );
    if (response.ok) {
      const data = await response.json();
      return { city: data.places[0]["place name"], error: null };
    } else {
      return { city: null, error: "Invalid postal code" };
    }
  } catch (error) {
    console.error("Error fetching city data:", error);
    return { city: null, error: "Error checking the postal code" };
  }
};

export const countryToTaxIdType: Record<string, string> = {
  AD: "ad_nrt", // Andorra
  AE: "ae_trn", // United Arab Emirates
  AR: "ar_cuit", // Argentina
  AU: "au_abn", // Australia (ABN)
  AU_ARN: "au_arn", // Australia (ARN)
  BG: "bg_uic", // Bulgaria
  BH: "bh_vat", // Bahrain
  BO: "bo_tin", // Bolivia
  BR_CNPJ: "br_cnpj", // Brazil (CNPJ)
  BR_CPF: "br_cpf", // Brazil (CPF)
  BY: "by_tin", // Belarus
  CA: "ca_bn", // Canada (BN)
  CA_GST_HST: "ca_gst_hst", // Canada (GST/HST)
  CA_PST_BC: "ca_pst_bc", // Canada (PST BC)
  CA_PST_MB: "ca_pst_mb", // Canada (PST MB)
  CA_PST_SK: "ca_pst_sk", // Canada (PST SK)
  CA_QST: "ca_qst", // Canada (QST)
  CH_UID: "ch_uid", // Switzerland (UID)
  CH_VAT: "ch_vat", // Switzerland (VAT)
  CL: "cl_tin", // Chile
  CN: "cn_tin", // China
  CO: "co_nit", // Colombia
  CR: "cr_tin", // Costa Rica
  DE: "de_stn", // Germany
  DO: "do_rcn", // Dominican Republic
  EC: "ec_ruc", // Ecuador
  EG: "eg_tin", // Egypt
  ES: "es_cif", // Spain
  EU_OSS: "eu_oss_vat", // EU (OSS VAT)
  EU: "eu_vat", // EU (VAT)
  GB: "gb_vat", // United Kingdom
  GE: "ge_vat", // Georgia
  HK: "hk_br", // Hong Kong
  HR: "hr_oib", // Croatia
  HU: "hu_tin", // Hungary
  ID: "id_npwp", // Indonesia
  IL: "il_vat", // Israel
  IN: "in_gst", // India
  IS: "is_vat", // Iceland
  JP_CN: "jp_cn", // Japan (Corporate Number)
  JP_RN: "jp_rn", // Japan (Registered Number)
  JP_TRN: "jp_trn", // Japan (Tax Registration Number)
  KE: "ke_pin", // Kenya
  KR: "kr_brn", // South Korea
  KZ: "kz_bin", // Kazakhstan
  LI: "li_uid", // Liechtenstein
  MA: "ma_vat", // Morocco
  MD: "md_vat", // Moldova
  MX: "mx_rfc", // Mexico
  MY_FRP: "my_frp", // Malaysia (FRP)
  MY_ITN: "my_itn", // Malaysia (ITN)
  MY_SST: "my_sst", // Malaysia (SST)
  NG: "ng_tin", // Nigeria
  NO: "no_vat", // Norway
  NO_VOEC: "no_voec", // Norway (VOEC)
  NZ: "nz_gst", // New Zealand
  OM: "om_vat", // Oman
  PE: "pe_ruc", // Peru
  PH: "ph_tin", // Philippines
  RO: "ro_tin", // Romania
  RS: "rs_pib", // Serbia
  RU_INN: "ru_inn", // Russia (INN)
  RU_KPP: "ru_kpp", // Russia (KPP)
  SA: "sa_vat", // Saudi Arabia
  SG_GST: "sg_gst", // Singapore (GST)
  SG_UEN: "sg_uen", // Singapore (UEN)
  SI: "si_tin", // Slovenia
  SV: "sv_nit", // El Salvador
  TH: "th_vat", // Thailand
  TR: "tr_tin", // Turkey
  TW: "tw_vat", // Taiwan
  TZ: "tz_vat", // Tanzania
  UA: "ua_vat", // Ukraine
  US: "us_ein", // United States
  UY: "uy_ruc", // Uruguay
  UZ_TIN: "uz_tin", // Uzbekistan (TIN)
  UZ_VAT: "uz_vat", // Uzbekistan (VAT)
  VE: "ve_rif", // Venezuela
  VN: "vn_tin", // Vietnam
  ZA: "za_vat", // South Africa
};

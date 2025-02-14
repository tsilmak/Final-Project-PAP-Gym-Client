export interface BenefitType {
  icon: JSX.Element;
  title: string;
  description: string;
  link: string;
}

export interface ModalityType {
  name: string;
  description?: string;
  image: string;
}

export type Plan = {
  name: string;
  price: number;
  highlightedPlan: boolean;
  features: { name: string; included: boolean }[];
};

export interface CountryApiResponse {
  name: { common: string };
  tld: string[];
}
export interface Country {
  tld: string;
  name: string;
}

export type tProducts = {
  _id?: string;
  englishName: string;
  banglaName: string;
  buyingPrice: number;
  sellingPrice: number;
  image: string;
  expiredDate: Date | null;
  strock: number | null;
  barCode: number | null;
};

export type tProducts = {
  _id?: string;
  englishName: string;
  banglaName: string;
  buyingPrice: number;
  sellingPrice: number;
  image: string;
  expiredDate?: Date | null;
  stock?: number | null;
  barCode?: number | null;
};

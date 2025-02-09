export interface Cart {
  product: {
    _id: string;
    title: string;
    imageUrl: string;
    description: string;
    price: number;
  }
  quantity: number;
}

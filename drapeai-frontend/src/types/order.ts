export interface OrderItemPayload {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface ShippingAddressPayload {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderRequestPayload {
  items: OrderItemPayload[];
  shippingFee: number;
  shippingAddress: ShippingAddressPayload;
}

export interface OrderResponsePayload {
  id: string;
  userEmail: string;
  items: OrderItemPayload[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  shippingAddress: ShippingAddressPayload;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  createdAt: string;
}

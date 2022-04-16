type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
};

export const paymentMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'كاش',
    icon: 'money-bill-alt',
    isChecked: true,
  },
  {
    id: '2',
    name: 'ATM كارت',
    icon: 'credit-card',
  },
];

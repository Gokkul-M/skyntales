import { forwardRef } from "react";

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    state?: string;
    zipCode: string;
    country?: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  createdAt: any;
  paymentId?: string;
}

interface OrderReceiptProps {
  order: Order;
}

const numberToWords = (num: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertLessThanThousand(n % 100) : '');
  };

  if (num === 0) return 'Zero';

  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);

  let result = '';
  if (intPart >= 10000000) {
    result += convertLessThanThousand(Math.floor(intPart / 10000000)) + ' Crore ';
    num = intPart % 10000000;
  }
  if (intPart >= 100000) {
    result += convertLessThanThousand(Math.floor((intPart % 10000000) / 100000)) + ' Lakh ';
  }
  if (intPart >= 1000) {
    result += convertLessThanThousand(Math.floor((intPart % 100000) / 1000)) + ' Thousand ';
  }
  if (intPart >= 100) {
    result += convertLessThanThousand(Math.floor((intPart % 1000) / 100)) + ' Hundred ';
  }
  result += convertLessThanThousand(intPart % 100);

  if (decPart > 0) {
    result += ' and ' + convertLessThanThousand(decPart) + ' Paise';
  }

  return result.trim() + ' Only';
};

const OrderReceipt = forwardRef<HTMLDivElement, OrderReceiptProps>(({ order }, ref) => {
  const orderDate = order.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) || new Date().toLocaleDateString('en-IN');

  const invoiceNumber = `INV-${order.orderNumber}`;

  return (
    <div ref={ref} className="bg-white text-black p-8 max-w-4xl mx-auto font-sans text-sm print:p-4">
      <style>{`
        @media print {
          @page { margin: 10mm; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="border-2 border-black">
        <div className="border-b-2 border-black p-4 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <img src="/favicon.ico" alt="Skyntales" className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-bold tracking-wide">SKYNTALES</h1>
              <p className="text-xs text-gray-600">Premium Skincare</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold">Tax Invoice/Bill of Supply</h2>
            <p className="text-xs text-gray-600">(Original for Recipient)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 border-b-2 border-black">
          <div className="p-4 border-r-2 border-black">
            <h3 className="font-bold text-xs mb-2 border-b border-gray-300 pb-1">Sold By:</h3>
            <p className="font-semibold">Skyntales Pvt. Ltd.</p>
            <p className="text-xs text-gray-700 mt-1">
              123, Skincare Avenue,<br />
              Mumbai, Maharashtra, 400001<br />
              India
            </p>
            <div className="mt-3 text-xs">
              <p><span className="font-semibold">PAN No:</span> XXXXXXXXXX</p>
              <p><span className="font-semibold">GST Registration No:</span> Not Applicable</p>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-bold text-xs mb-2 border-b border-gray-300 pb-1">Billing Address:</h3>
            <p className="font-semibold">{order.shipping.firstName} {order.shipping.lastName}</p>
            <p className="text-xs text-gray-700 mt-1">
              {order.shipping.address}<br />
              {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}<br />
              {order.shipping.country || 'India'}
            </p>
            {order.shipping.phone && (
              <p className="text-xs mt-2"><span className="font-semibold">Phone:</span> {order.shipping.phone}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 border-b-2 border-black">
          <div className="p-4 border-r-2 border-black text-xs">
            <p><span className="font-semibold">Order Number:</span> {order.orderNumber}</p>
            <p><span className="font-semibold">Order Date:</span> {orderDate}</p>
            {order.paymentId && (
              <p><span className="font-semibold">Payment ID:</span> {order.paymentId}</p>
            )}
          </div>
          <div className="p-4 text-xs">
            <p><span className="font-semibold">Invoice Number:</span> {invoiceNumber}</p>
            <p><span className="font-semibold">Invoice Date:</span> {orderDate}</p>
          </div>
        </div>

        <div className="p-4 border-b-2 border-black">
          <h3 className="font-bold text-xs mb-2 border-b border-gray-300 pb-1">Shipping Address:</h3>
          <p className="font-semibold">{order.shipping.firstName} {order.shipping.lastName}</p>
          <p className="text-xs text-gray-700 mt-1">
            {order.shipping.address}<br />
            {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}<br />
            {order.shipping.country || 'India'}
          </p>
        </div>

        <div className="border-b-2 border-black">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100 border-b border-black">
                <th className="p-2 text-left border-r border-gray-300">S.No</th>
                <th className="p-2 text-left border-r border-gray-300">Description</th>
                <th className="p-2 text-right border-r border-gray-300">Unit Price</th>
                <th className="p-2 text-center border-r border-gray-300">Qty</th>
                <th className="p-2 text-right border-r border-gray-300">Net Amount</th>
                <th className="p-2 text-center border-r border-gray-300">Tax Rate</th>
                <th className="p-2 text-right border-r border-gray-300">Tax Amount</th>
                <th className="p-2 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => {
                const netAmount = item.price * item.quantity;
                const taxAmount = 0;
                const totalAmount = netAmount + taxAmount;
                return (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-2 border-r border-gray-300">{index + 1}</td>
                    <td className="p-2 border-r border-gray-300">
                      <p className="font-medium">{item.name}</p>
                      {item.size && <p className="text-gray-500">Size: {item.size}</p>}
                    </td>
                    <td className="p-2 text-right border-r border-gray-300">₹{item.price.toFixed(2)}</td>
                    <td className="p-2 text-center border-r border-gray-300">{item.quantity}</td>
                    <td className="p-2 text-right border-r border-gray-300">₹{netAmount.toFixed(2)}</td>
                    <td className="p-2 text-center border-r border-gray-300">0%</td>
                    <td className="p-2 text-right border-r border-gray-300">₹0.00</td>
                    <td className="p-2 text-right font-medium">₹{totalAmount.toFixed(2)}</td>
                  </tr>
                );
              })}
              {order.shippingCost > 0 && (
                <tr className="border-b border-gray-200">
                  <td className="p-2 border-r border-gray-300"></td>
                  <td className="p-2 border-r border-gray-300">Shipping Charges</td>
                  <td className="p-2 text-right border-r border-gray-300">₹{order.shippingCost.toFixed(2)}</td>
                  <td className="p-2 text-center border-r border-gray-300">1</td>
                  <td className="p-2 text-right border-r border-gray-300">₹{order.shippingCost.toFixed(2)}</td>
                  <td className="p-2 text-center border-r border-gray-300">0%</td>
                  <td className="p-2 text-right border-r border-gray-300">₹0.00</td>
                  <td className="p-2 text-right">₹{order.shippingCost.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 border-b-2 border-black">
          <div className="p-4 border-r-2 border-black">
            <h3 className="font-bold text-xs mb-2">Amount in Words:</h3>
            <p className="text-xs font-medium">Rupees {numberToWords(order.total)}</p>
          </div>
          <div className="p-4">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm border-t border-black pt-2 mt-2">
                <span>TOTAL:</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b-2 border-black bg-gray-50">
          <h3 className="font-bold text-xs mb-2">Terms & Conditions:</h3>
          <ol className="text-[10px] text-gray-600 list-decimal list-inside space-y-1">
            <li>Goods once sold will not be taken back or exchanged.</li>
            <li>Subject to Mumbai jurisdiction only.</li>
            <li>E. & O.E. (Errors and Omissions Excepted)</li>
            <li>This is a computer generated invoice and does not require signature.</li>
          </ol>
        </div>

        <div className="p-4 text-center text-xs text-gray-500">
          <p className="font-semibold">Thank you for shopping with Skyntales!</p>
          <p className="mt-1">For queries, contact: support@skyntales.com | www.skyntales.com</p>
        </div>
      </div>
    </div>
  );
});

OrderReceipt.displayName = 'OrderReceipt';

export default OrderReceipt;

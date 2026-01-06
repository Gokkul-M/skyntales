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
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' And ' + convertLessThanThousand(n % 100) : '');
  };

  if (num === 0) return 'Zero';

  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);

  let result = '';
  
  if (intPart >= 10000000) {
    result += convertLessThanThousand(Math.floor(intPart / 10000000)) + ' Crore ';
  }
  if (intPart >= 100000) {
    const lakhPart = Math.floor((intPart % 10000000) / 100000);
    if (lakhPart > 0) result += convertLessThanThousand(lakhPart) + ' Lakh ';
  }
  if (intPart >= 1000) {
    const thousandPart = Math.floor((intPart % 100000) / 1000);
    if (thousandPart > 0) result += convertLessThanThousand(thousandPart) + ' Thousand ';
  }
  const remainder = intPart % 1000;
  if (remainder > 0) {
    result += convertLessThanThousand(remainder);
  }

  if (decPart > 0) {
    result += ' And ' + convertLessThanThousand(decPart) + ' Paise';
  }

  return result.trim() + ' Only';
};

const OrderReceipt = forwardRef<HTMLDivElement, OrderReceiptProps>(({ order }, ref) => {
  const orderDate = order.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) || new Date().toLocaleDateString('en-IN');

  const invoiceNumber = `SKYN-${order.orderNumber}`;
  const stateCode = "27";

  return (
    <div ref={ref} className="bg-white text-black p-6 max-w-[210mm] mx-auto" style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', lineHeight: '1.4' }}>
      <style>{`
        @media print {
          @page { size: A4; margin: 8mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        .invoice-table { border-collapse: collapse; width: 100%; }
        .invoice-table th, .invoice-table td { border: 1px solid #000; padding: 4px 6px; }
        .invoice-table th { background-color: #f5f5f5; font-weight: bold; text-align: left; }
      `}</style>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
        <tbody>
          <tr>
            <td colSpan={2} style={{ borderBottom: '1px solid #000', padding: '12px' }}>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <img src="/favicon.ico" alt="Skyntales" style={{ height: '32px', width: '32px' }} />
                        <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>Skyntales</span>
                      </div>
                    </td>
                    <td style={{ width: '50%', textAlign: 'right', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Tax Invoice/Bill of Supply/Cash Memo</div>
                      <div style={{ fontSize: '10px', color: '#666' }}>(Original for Recipient)</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style={{ width: '50%', borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '10px', verticalAlign: 'top' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Sold By :</div>
              <div>Skyntales Pvt. Ltd.</div>
              <div style={{ fontSize: '10px', color: '#333', marginTop: '2px' }}>
                * 123, Skincare Avenue,<br />
                Mumbai, Maharashtra, 400001<br />
                IN
              </div>
              <div style={{ marginTop: '8px' }}>
                <div><strong>PAN No:</strong> AABCS1234K</div>
                <div><strong>GST Registration No:</strong> NotApplicable</div>
              </div>
            </td>
            <td style={{ width: '50%', borderBottom: '1px solid #000', padding: '10px', verticalAlign: 'top' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Billing Address :</div>
              <div>{order.shipping.firstName} {order.shipping.lastName}</div>
              <div style={{ fontSize: '10px', color: '#333' }}>
                {order.shipping.address}<br />
                {order.shipping.city}, {order.shipping.state}, {order.shipping.zipCode}<br />
                {order.shipping.country || 'IN'}
              </div>
              <div style={{ marginTop: '4px' }}><strong>State/UT Code:</strong> {stateCode}</div>
              
              <div style={{ fontWeight: 'bold', marginTop: '12px', marginBottom: '4px' }}>Shipping Address :</div>
              <div>{order.shipping.firstName} {order.shipping.lastName}</div>
              <div style={{ fontSize: '10px', color: '#333' }}>
                {order.shipping.address}<br />
                {order.shipping.city}, {order.shipping.state}, {order.shipping.zipCode}<br />
                {order.shipping.country || 'IN'}
              </div>
              <div style={{ marginTop: '4px' }}><strong>State/UT Code:</strong> {stateCode}</div>
              <div><strong>Place of supply:</strong> {order.shipping.state || 'MAHARASHTRA'}</div>
              <div><strong>Place of delivery:</strong> {order.shipping.state || 'MAHARASHTRA'}</div>
            </td>
          </tr>

          <tr>
            <td style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '10px', verticalAlign: 'top' }}>
              <div><strong>Order Number:</strong> {order.orderNumber}</div>
              <div><strong>Order Date:</strong> {orderDate}</div>
            </td>
            <td style={{ borderBottom: '1px solid #000', padding: '10px', verticalAlign: 'top' }}>
              <div><strong>Invoice Number :</strong> {invoiceNumber}</div>
              <div><strong>Invoice Details :</strong> {order.paymentId || 'N/A'}</div>
              <div><strong>Invoice Date :</strong> {orderDate}</div>
            </td>
          </tr>

          <tr>
            <td colSpan={2} style={{ padding: '0' }}>
              <table className="invoice-table" style={{ borderCollapse: 'collapse', width: '100%', fontSize: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left', width: '30px' }}>Sl.<br/>No</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>Description</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', width: '60px' }}>Unit<br/>Price</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', width: '50px' }}>Discount</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '30px' }}>Qty</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', width: '60px' }}>Net<br/>Amount</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '50px' }}>Tax<br/>Rate</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '50px' }}>Tax<br/>Type</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', width: '50px' }}>Tax<br/>Amount</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', width: '70px' }}>Total<br/>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => {
                    const netAmount = item.price * item.quantity;
                    return (
                      <tr key={index}>
                        <td style={{ border: '1px solid #000', padding: '6px', verticalAlign: 'top' }}>{index + 1}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', verticalAlign: 'top' }}>
                          {item.name}
                          {item.size && <span style={{ fontSize: '9px', color: '#666' }}> | Size: {item.size}</span>}
                        </td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', verticalAlign: 'top' }}>₹{item.price.toFixed(2)}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', verticalAlign: 'top' }}>₹0.00</td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', verticalAlign: 'top' }}>{item.quantity}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', verticalAlign: 'top' }}>₹{netAmount.toFixed(2)}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', verticalAlign: 'top' }}>
                          0%<br/>0%<br/>0%
                        </td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', verticalAlign: 'top' }}>
                          CGST<br/>SGST<br/>IGST
                        </td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', verticalAlign: 'top' }}>
                          ₹0.00<br/>₹0.00<br/>₹0.00
                        </td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold', verticalAlign: 'top' }}>₹{netAmount.toFixed(2)}</td>
                      </tr>
                    );
                  })}

                  {order.shippingCost > 0 && (
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px' }}></td>
                      <td style={{ border: '1px solid #000', padding: '6px' }}>Shipping Charges</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>₹{order.shippingCost.toFixed(2)}</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>-₹0.00</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>1</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>₹{order.shippingCost.toFixed(2)}</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>0%</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>None</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>₹0.00</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>₹{order.shippingCost.toFixed(2)}</td>
                    </tr>
                  )}

                  <tr style={{ backgroundColor: '#f9f9f9' }}>
                    <td colSpan={5} style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold' }}>TOTAL:</td>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>₹{order.subtotal.toFixed(2)}</td>
                    <td colSpan={3} style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>₹0.00</td>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontWeight: 'bold', fontSize: '12px' }}>₹{order.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td colSpan={2} style={{ borderTop: '1px solid #000', padding: '10px', backgroundColor: '#fffbe6' }}>
              <div style={{ fontWeight: 'bold' }}>Amount in Words:</div>
              <div>{numberToWords(order.total)}</div>
            </td>
          </tr>

          <tr>
            <td colSpan={2} style={{ borderTop: '1px solid #000', padding: '10px', fontSize: '9px', color: '#666' }}>
              <div>Whether tax is payable under reverse charge - No</div>
              <div style={{ marginTop: '8px' }}>
                This is a computer generated invoice and does not require a physical signature.
              </div>
            </td>
          </tr>

          <tr>
            <td colSpan={2} style={{ borderTop: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '10px' }}>
              <strong>Thank you for shopping with Skyntales!</strong>
              <div style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>
                For queries: support@skyntales.com | www.skyntales.com
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

OrderReceipt.displayName = 'OrderReceipt';

export default OrderReceipt;

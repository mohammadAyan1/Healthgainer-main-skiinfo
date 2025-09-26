"use client";

export default function ShippingPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        🚚 Shipping & Delivery Policy
      </h1>
      <p className="text-lg text-center text-gray-600 mb-8">
        Thank you for shopping with HealthGainer! Please read our shipping and delivery policy to understand how we handle your orders.
      </p>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-2">📍 Serviceable Areas</h2>
          <p>
            - We currently ship across all major cities and towns in India. <br />
            - If your pin code is not serviceable, we will notify you and issue a full refund for prepaid orders.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">⏱️ Order Processing Time</h2>
          <p>
            - Orders are typically processed and dispatched within <strong>1–2 business days</strong> from the date of order confirmation. <br />
            - Orders placed on weekends or holidays will be processed on the next business day.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">🚚 Estimated Delivery Time</h2>
          <p>
            - Estimated delivery time is <strong>3–7 business days</strong> depending on your location. <br />
            - Remote or rural areas may take longer due to courier constraints.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">💳 Shipping Charges</h2>
          <p>
            - We offer <strong>free shipping</strong> on all prepaid orders above ₹499. <br />
            - For orders below ₹499, a nominal shipping fee of ₹49 will apply. <br />
            - Cash on Delivery (COD), if available, may include additional handling charges.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">📦 Tracking Your Order</h2>
          <p>
            - Once your order is dispatched, you will receive a tracking link via SMS or email. <br />
            - You can use this link to check the real-time status of your delivery.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">⚠️ Delivery Delays</h2>
          <p>
            - HealthGainer is not liable for delays caused by natural disasters, public holidays, courier delays, or incorrect shipping details. <br />
            - Please ensure your delivery address and contact number are correct at checkout.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">📞 Contact Us</h2>
          <p>
            For any questions about shipping or delivery, feel free to contact us at: <br />
            <span className="font-semibold">teamhealthgainer@gmail.com</span>
          </p>
        </section>
      </div>
    </div>
  );
}

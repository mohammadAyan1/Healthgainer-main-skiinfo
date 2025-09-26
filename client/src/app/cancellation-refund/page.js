"use client";

export default function CancellationRefundPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        🔄 Cancellation & Refund Policy
      </h1>
      <p className="text-lg text-center text-gray-600 mb-8">
        Your satisfaction is important to us! Please review our cancellation and refund policies below to understand your rights and our obligations.
      </p>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-2">❌ Order Cancellation</h2>
          <p>
            - You may cancel your order within <strong>24 hours</strong> of placing it, provided it has not been processed or shipped. <br />
            - Once shipped, the order cannot be canceled. <br />
            - To request a cancellation, please email us at{" "}
            <span className="font-semibold">teamhealthgainer@gmail.com</span> with your order number and reason.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">📦 Return & Refund Policy</h2>
          <p>
            - Returns are accepted within <strong>7 days</strong> of delivery if the product is unused, unopened, and in its original packaging. <br />
            - Products that are damaged, defective, or incorrect are eligible for return or replacement. <br />
            - Shipping and handling charges are <strong>non-refundable</strong> unless the return is due to our error.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">🔍 Refund Eligibility</h2>
          <p>
            - Returned items must be in unused, resalable condition. <br />
            - Any consumable health products that are opened or used are <strong>not eligible</strong> for return due to hygiene reasons. <br />
            - Please retain the original invoice or order confirmation email as proof of purchase.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">🚚 Refund Process</h2>
          <p>
            - Send an email to <span className="font-semibold">teamhealthgainer@gmail.com</span> with your order number, reason for return, and photo of the product (if applicable). <br />
            - Once your return is received and inspected, your refund will be processed within <strong>5–7 business days</strong>. <br />
            - Refunds will be made via the original method of payment (e.g., Razorpay, UPI, card).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">⚠️ Exceptions</h2>
          <p>
            - Perishable or opened health supplements are non-returnable unless they are defective or damaged during transit. <br />
            - Orders made with discount coupons or during special promotions may not be eligible for full refunds. <br />
            - Refunds may be denied if the return does not meet our policy conditions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">📞 Contact Us</h2>
          <p>
            If you have any questions or concerns regarding cancellation or refund, please reach out to us at: <br />
            <span className="font-semibold">teamhealthgainer@gmail.com</span>
          </p>
        </section>
      </div>
    </div>
  );
}

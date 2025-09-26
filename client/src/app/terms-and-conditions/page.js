"use client";

export default function TermsAndConditions() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        📜 Terms & Conditions
      </h1>
      <p className="text-lg text-center text-gray-600 mb-8">
        Welcome to HealthGainer! Please read these terms carefully before using our website or making a purchase. By continuing to browse or buy from our platform, you agree to comply with and be bound by the following terms.
      </p>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-2">🛒 Use of Our Website</h2>
          <p>
            - You must be at least 18 years old to use our services and place orders. <br />
            - You agree not to misuse the website, hack, spam, or attempt unauthorized access. <br />
            - We reserve the right to suspend or terminate access if terms are violated.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">📦 Orders & Payments</h2>
          <p>
            - All prices are listed in INR (₹) and include applicable taxes unless stated otherwise. <br />
            - Payments are securely processed via Razorpay. We do not store your card details on our servers. <br />
            - An order is considered confirmed only after successful payment. <br />
            - We reserve the right to cancel or refuse any order in case of payment issues or product unavailability.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">🚚 Shipping & Delivery</h2>
          <p>
            - We ship products across India within 2–5 business days of order confirmation. <br />
            - Delivery timelines may vary based on your location and courier delays. <br />
            - Customers are responsible for providing accurate delivery details. We are not liable for misdeliveries due to incorrect address.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">🔄 Returns & Refunds</h2>
          <p>
            - You may request a return within 7 days of receiving the product, provided the item is unused, sealed, and in its original packaging. <br />
            - To initiate a return, please contact our support team with your order number and reason for return. <br />
            - Refunds (if approved) will be credited to your original payment method within 7–10 working days after inspection. <br />
            - Shipping costs are non-refundable unless the return is due to a defective or incorrect item.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">🔒 Privacy & Security</h2>
          <p>
            - Your personal data is safe with us. We use SSL encryption and secure servers for transactions. <br />
            - Payment is handled through trusted gateways like Razorpay. We do not store sensitive card information. <br />
            - Please read our <a href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</a> for more details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">⚠️ Product Disclaimer</h2>
          <p>
            - Our health supplements are not intended to diagnose, treat, cure, or prevent any disease. <br />
            - Consult a medical professional before starting any new supplement, especially if you are pregnant, nursing, or under medication. <br />
            - Use products strictly as directed on the label.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">⚖️ Governing Law & Disputes</h2>
          <p>
            - These terms shall be governed by the laws of India. <br />
            - Any disputes shall be subject to the jurisdiction of courts located in Indore, Madhya Pradesh.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">📞 Contact Us</h2>
          <p>
            For any questions, support, or complaints, you may contact us at: <br />
            <span className="font-semibold">teamhealthgainer@gmail.com</span>
          </p>
        </section>
      </div>
    </div>
  );
}

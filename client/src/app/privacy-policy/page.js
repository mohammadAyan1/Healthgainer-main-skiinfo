"use client";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        🔒 Privacy Policy
      </h1>
      <p className="text-lg text-center text-gray-600 mb-8">
        Your privacy is important to us. This policy explains how we collect,
        use, and protect your information. 🛡️
      </p>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-2">📌 Information We Collect</h2>
          <p>
            We collect personal information such as your name, email address,
            phone number, billing/shipping address, and payment details when you
            make a purchase or interact with our platform. We also use cookies
            and tracking technologies to enhance your browsing experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">⚡ How We Use Your Information</h2>
          <p>
            We use your information to process transactions, manage orders,
            provide customer service, send updates and marketing offers (if opted-in),
            and improve our website and services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">💳 Payment Processing</h2>
          <p>
            We use Razorpay as our trusted payment gateway partner. All payment
            transactions are processed through Razorpay’s secure platform. Razorpay
            collects and processes your payment information in accordance with
            their own privacy policy. We do not store your credit/debit card
            details on our servers.
          </p>
          <p className="mt-2">
            For more information, please refer to{" "}
            <a
              href="https://razorpay.com/privacy/"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Razorpay&apos;s Privacy Policy
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">🛑 Data Protection & Security</h2>
          <p>
            We implement industry-standard security measures including SSL encryption,
            firewalls, and secure servers to protect your personal data from unauthorized
            access, disclosure, or misuse.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">🌍 Third-Party Services</h2>
          <p>
            Apart from Razorpay, we may use other third-party services such as analytics,
            email marketing tools, or customer support platforms. These services
            have their own privacy policies governing the use of your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">📅 Changes to Privacy Policy</h2>
          <p>
            We may update this policy periodically. Any significant changes will be
            posted on this page with the updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">📞 Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding our privacy
            policy or your personal data, feel free to contact us at{" "}
            <span className="font-semibold">teamhealthgainer@gmail.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}

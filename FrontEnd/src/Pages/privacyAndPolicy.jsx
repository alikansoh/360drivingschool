import React from "react";

export default function PrivacyPolicy() {
  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-screen-lg mx-auto px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Your privacy is critically important to us. This Privacy Policy
          document outlines the types of information that we collect and how we
          use, store, and protect that information.
        </p>

        {/* Information Collection */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li>
              <strong>Personal Information:</strong> When you sign up, contact
              us, or use our services, we may collect personal information such
              as your name, email address, phone number, and any other details
              you provide.
            </li>
            <li>
              <strong>Usage Data:</strong> We may collect data about how you use
              our website, such as IP addresses, browser types, operating
              systems, and browsing behavior.
            </li>
            <li>
              <strong>Cookies:</strong> Our site uses cookies to improve your
              experience and provide personalized content.
            </li>
          </ul>
        </div>

        {/* How We Use Information */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We collect your information to provide, improve, and protect our
            services. Specifically, we use your information to:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li>Respond to your inquiries and provide customer support.</li>
            <li>Send updates, promotional emails, or other relevant information.</li>
            <li>Improve our website and user experience.</li>
            <li>Comply with legal requirements and protect against fraud.</li>
          </ul>
        </div>

        {/* Data Sharing */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Sharing Your Information
          </h2>
          <p className="text-gray-700">
            We respect your privacy and will never sell your information to
            third parties. However, we may share your data with trusted
            third-party services for the following reasons:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-gray-700 mt-4">
            <li>
              <strong>Service Providers:</strong> To help us provide and
              maintain our services.
            </li>
            <li>
              <strong>Legal Requirements:</strong> To comply with applicable
              laws, regulations, or legal processes.
            </li>
          </ul>
        </div>

        {/* Data Protection */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Protecting Your Data
          </h2>
          <p className="text-gray-700">
            We take reasonable steps to secure your personal information
            against unauthorized access, alteration, disclosure, or
            destruction. However, no internet-based service can be completely
            secure, and we encourage you to protect your data when using online
            platforms.
          </p>
        </div>

        {/* Your Rights */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your Rights
          </h2>
          <p className="text-gray-700">
            Depending on your location, you may have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-gray-700 mt-4">
            <li>Access the personal data we hold about you.</li>
            <li>Request corrections to any inaccurate data.</li>
            <li>Request that we delete your personal data.</li>
            <li>
              Opt-out of marketing communications or withdraw consent for data
              processing.
            </li>
          </ul>
          <p className="text-gray-700 mt-4">
            To exercise these rights, please contact us at{" "}
            <strong>privacy@company.com</strong>.
          </p>
        </div>

        {/* Updates */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Updates to This Policy
          </h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or for other operational, legal, or
            regulatory reasons. When we update the policy, we will post the new
            version on this page and update the effective date.
          </p>
        </div>

        {/* Contact Us */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700">
            If you have any questions or concerns about this Privacy Policy,
            please contact us at:
          </p>
          <p className="text-gray-700 mt-4">
            <strong>Email:</strong> privacy@company.com
          </p>
          <p className="text-gray-700">
            <strong>Address:</strong> 123 Privacy Lane, Suite 456, City,
            Country
          </p>
        </div>
      </div>
    </section>
  );
}

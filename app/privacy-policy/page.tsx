import Link from "next/link"

export default function PrivacyPolicy2() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 bg-opacity-80 p-6 md:p-10 rounded-lg shadow-xl">
        <header className="mb-8 border-b border-purple-500 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Privacy Policy
          </h1>
          <p className="text-center text-gray-300 mt-2">
            Last Updated: June 5, 2025
          </p>
        </header>

        <div className="space-y-8">
          {/* Who We Are */}
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Who We Are</h2>
            <p className="mb-3">
              This Privacy Policy applies to the{" "}
              <strong>[App Name]</strong> games and website (the &quot;Service&quot;),
              operated by <strong>[Your Name or Company Name]</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
              The Service includes our clicker games available on the web and, where applicable,
              on the Google Play Store as an Android app.
            </p>
          </section>

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Introduction</h2>
            <p className="mb-3">
              We respect your privacy and are committed to protecting your data.
              This Privacy Policy explains what information we collect, how we use it,
              and what choices you have when you use our games and website.
            </p>
            <p>
              By accessing or using our Service, you agree to the collection and use of
              information in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Scope */}
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Scope of This Policy</h2>
            <p className="mb-3">
              This Privacy Policy covers:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Our clicker games played through your web browser.</li>
              <li>
                Any Android version of our games published on the Google Play Store
                that loads or embeds this website or game content.
              </li>
            </ul>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Information We Collect</h2>
            <p className="mb-3">
              Our games primarily use storage on your device to save your game progress and settings.
              This may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Game progress (scores, achievements, levels)</li>
              <li>Game preferences and settings</li>
              <li>Basic performance data to optimize your gaming experience</li>
            </ul>
            <p className="mb-3">
              We do <strong>not</strong> require you to create an account and we do{" "}
              <strong>not</strong> store your game data on our own servers unless explicitly
              stated for a specific feature.
            </p>
            <p>
              We do not intentionally collect personally identifiable information such as your
              name, address, or contact information, unless you choose to provide it to us
              (for example, if you contact us by email).
            </p>
          </section>

          {/* Local Storage */}
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Local Storage and Cookies</h2>
            <p className="mb-3">
              Our games may use browser local storage, session storage, or similar technologies
              to save your game data directly on your device. This allows us to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Save and restore your game progress</li>
              <li>Remember your preferences and settings</li>
              <li>Maintain basic functionality of the games</li>
            </ul>
            <p className="mb-3">
              This data remains on your device and is not automatically transmitted to us.
              You can clear this data at any time by:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Using the reset button or option within our games (where available)</li>
              <li>Clearing your browser&apos;s storage and cookies through your browser settings</li>
            </ul>
          </section>

          {/* Analytics and Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">
              Analytics and Third-Party Services
            </h2>
            <p className="mb-3">
              We may use third-party analytics tools (such as game analytics or usage statistics)
              to help us understand how our games are used and to improve them over time.
              These tools may collect information such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Pages or screens visited</li>
              <li>Time spent in the game</li>
              <li>Basic device and browser information</li>
              <li>Crash or error reports</li>
            </ul>
            <p>
              We use this information in aggregated or anonymized form whenever possible,
              and we do not use it to personally identify individual users.
              Please review the privacy policies of any third-party services used for more details.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Data Retention</h2>
            <p className="mb-3">
              Game data stored locally on your device is kept until you delete it
              (for example, by resetting the game or clearing your browser data).
            </p>
            <p>
              Any analytics or error data processed by third-party services is retained
              according to their own retention policies.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Children&apos;s Privacy</h2>
            <p className="mb-3">
              Our games are intended for a general audience and are not specifically directed
              to children under the age of 13 (or the age required by law in your country).
              We do not knowingly collect personal information from children.
            </p>
            <p>
              If you are a parent or guardian and believe that your child has provided us with
              personal information, please contact us so that we can take appropriate action,
              such as deleting that information.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Your Choices and Rights</h2>
            <p className="mb-3">
              Depending on your location and applicable law, you may have certain rights
              regarding your data. In particular, you can:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Reset or delete your game data stored in local storage</li>
              <li>Clear browser storage and cookies through your browser settings</li>
              <li>Contact us to ask what information we hold about you, if any</li>
              <li>Request that we delete any personal information you have provided to us</li>
            </ul>
            <p>
              To exercise these rights or ask questions, please use the contact information
              provided in the &quot;Contact Us&quot; section below.
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your data.
              However, please note that no method of transmission over the internet or electronic
              storage is 100% secure. While we strive to protect your data, we cannot guarantee
              its absolute security.
            </p>
          </section>

          {/* Changes to This Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Changes to This Privacy Policy</h2>
            <p className="mb-3">
              We may update this Privacy Policy from time to time. When we do, we will post the
              updated version on this page and revise the &quot;Last Updated&quot; date at the top.
            </p>
            <p>
              We encourage you to review this Privacy Policy periodically for any changes.
              Your continued use of the Service after any updates means you accept the revised Policy.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Contact Us</h2>
            <p className="mb-3">
              If you have any questions about this Privacy Policy or how we handle your data,
              you can contact us at:
            </p>
            <p>
              Email: <strong>[your-contact-email@example.com]</strong>
              <br />
              (Please replace this with your actual contact email.)
            </p>
          </section>
        </div>

        <footer className="mt-10 pt-6 border-t border-purple-500 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
          >
            Return to Home
          </Link>
        </footer>
      </div>
    </div>
  )
}

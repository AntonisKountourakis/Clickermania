import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 bg-opacity-80 p-6 md:p-10 rounded-lg shadow-xl">
        <header className="mb-8 border-b border-purple-500 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Privacy Policy
          </h1>
          <p className="text-center text-gray-300 mt-2">Last Updated: June 5, 2025</p>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Introduction</h2>
            <p className="mb-3">
              Welcome to our Games Website. We respect your privacy and are committed to protecting your personal data.
              This privacy policy explains how we handle your information when you visit our website and play our
              clicker games.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Information We Collect</h2>
            <p className="mb-3">
              Our games primarily use local storage on your device to save your game progress and settings. This
              includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Game progress (scores, achievements, levels)</li>
              <li>Game preferences and settings</li>
              <li>Performance data to optimize your gaming experience</li>
            </ul>
            <p>We do not collect personally identifiable information unless you explicitly provide it to us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">How We Use Your Information</h2>
            <p className="mb-3">The information stored locally on your device is used solely to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Save and restore your game progress</li>
              <li>Remember your preferences and settings</li>
              <li>Improve game performance and user experience</li>
              <li>Fix bugs and technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Local Storage</h2>
            <p className="mb-3">
              Our games use browser local storage to save your game data directly on your device. This data remains on
              your device and is not transmitted to our servers unless explicitly stated for specific features.
            </p>
            <p className="mb-3">You can clear this data at any time by:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Using the reset button or option within our games</li>
              <li>Clearing your browser's local storage through your browser settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Analytics and Third-Party Services</h2>
            <p>
              We may use analytics tools to understand how our games are being used. These tools collect anonymous data
              about game usage patterns to help us improve our games. We do not use this data to identify individual
              users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Children's Privacy</h2>
            <p>
              Our games are designed for general audiences and we do not knowingly collect personal information from
              children under 13. If you are a parent or guardian and believe your child has provided us with personal
              information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your game data stored in local storage</li>
              <li>Delete your game data at any time</li>
              <li>Object to any processing of your data</li>
              <li>Request information about what data is stored locally</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Security</h2>
            <p>
              We implement appropriate technical measures to protect your data. However, please be aware that no method
              of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-3">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date.
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

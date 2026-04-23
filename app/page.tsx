import Image from "next/image";
import { Mail, Phone, Clock } from "lucide-react";
import ContactForm from "./ContactForm";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center px-6 py-12 text-center">
        {/* Logo */}
        <div className="mb-4">
          <div className="flex items-center justify-center">
            <Image
              src="/FTP Logo Transparent Background.png"
              alt="Fleet Trust Parts Logo"
              width={250}
              height={250}
              priority
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <p className="text-xl text-slate-600 font-medium">
              Full Website Coming Soon
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Contact
          </h2>

          <div className="space-y-4">
            {/* Email */}
            <a
              href="mailto:Victor@fleettrustparts.com"
              className="flex items-center justify-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
            >
              <Mail className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-slate-700 font-medium">
                Victor@fleettrustparts.com
              </span>
            </a>

            {/* Office Phone */}
            <a
              href="tel:+13138956600"
              className="flex items-center justify-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
            >
              <Phone className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-xs text-slate-500">Office</div>
                <div className="text-slate-700 font-medium">313-895-6600</div>
              </div>
            </a>

            {/* Cell Phone */}
            <a
              href="tel:+13139008059"
              className="flex items-center justify-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
            >
              <Phone className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-xs text-slate-500">Cell</div>
                <div className="text-slate-700 font-medium">313-900-8059</div>
              </div>
            </a>
          </div>

          <div className="my-6 border-t border-slate-200" />

          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Send us a message
          </h3>
          <ContactForm />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Fleet Trust Parts. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

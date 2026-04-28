import Image from "next/image";
import { Mail, Phone, Clock } from "lucide-react";
import ContactForm from "./ContactForm";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <main className="flex w-full max-w-5xl flex-col items-center px-6 py-12">
        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-12">
          {/* Left: brand + contact */}
          <div className="flex flex-col items-center gap-6">
            <Image
              src="/FTP Logo Transparent Background.png"
              alt="Fleet Trust Parts Logo"
              width={250}
              height={250}
              priority
            />

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <p className="text-lg text-slate-600 font-medium">
                Full Website Coming Soon
              </p>
            </div>

            <div className="w-full max-w-sm space-y-3">
              <a
                href="mailto:info@fleettrustparts.com"
                className="flex items-center gap-3 p-4 rounded-lg bg-white/70 hover:bg-white transition-colors group shadow-sm"
              >
                <Mail className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-slate-700 font-medium break-all">
                  info@fleettrustparts.com
                </span>
              </a>

              <a
                href="tel:+13139008059"
                className="flex items-center gap-3 p-4 rounded-lg bg-white/70 hover:bg-white transition-colors group shadow-sm"
              >
                <Phone className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-slate-700 font-medium">313-900-8059</span>
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">
              Send us a message
            </h2>
            <ContactForm />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-sm text-slate-500 text-center">
          <p>&copy; {new Date().getFullYear()} Fleet Trust Parts. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

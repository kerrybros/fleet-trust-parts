import Image from "next/image";
import { Mail, Phone, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center px-6 py-12 text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center w-32 h-32 bg-white rounded-2xl shadow-lg mb-6">
            <Image
              src="/logo.svg"
              alt="Fleet Trust Parts Logo"
              width={120}
              height={120}
              priority
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Fleet Trust Parts
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-blue-600" />
            <p className="text-xl text-slate-600 font-medium">
              Coming Soon
            </p>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We're building something great for the commercial vehicle industry. 
            Your trusted partner for quality parts and exceptional service.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Get in Touch
          </h2>
          
          <div className="space-y-4">
            {/* Email */}
            <a 
              href="mailto:info@fleettrustparts.com"
              className="flex items-center justify-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
            >
              <Mail className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-slate-700 font-medium">
                info@fleettrustparts.com
              </span>
            </a>

            {/* Phone */}
            <a 
              href="tel:+15555551234"
              className="flex items-center justify-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
            >
              <Phone className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-slate-700 font-medium">
                (555) 555-1234
              </span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Fleet Trust Parts. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

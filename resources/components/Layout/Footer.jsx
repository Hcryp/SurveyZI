import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Mail, Phone, MapPin, FileText, Shield, Globe, X } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and mission */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                className="h-14 w-auto"
                src="/logo_uin.png"
                alt="UIN Antasari Logo"
              />
              <div className="ml-4">
                <div className="font-display text-xl font-bold text-gray-900">
                  Survey UIN Antasari
                </div>
                <div className="text-sm text-blue-600">
                  Sistem Survei dan Direktori Layanan
                </div>
              </div>
            </div>
            <p className="text-base text-gray-600 leading-tight">
              Sistem Survei dan Direktori Layanan UIN Antasari ini bertujuan untuk meningkatkan 
              kualitas pelayanan dan menjamin transparansi di lingkungan kampus.
            </p>
          </div>

          {/* Contact information */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-6">
              KONTAK
            </h3>
            <ul className="space-y-5">
              <li className="flex text-base text-gray-600">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mr-3 mt-1" strokeWidth={2} />
                <div>
                  <p>Jl. A. Yani KM. 4,5</p>
                  <p>Banjarmasin, Kalimantan Selatan</p>
                  <p>70235</p>
                </div>
              </li>
              <li className="flex text-base text-gray-600 items-center">
                <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mr-3" strokeWidth={2} />
                <a href="mailto:info@uin-antasari.ac.id" className="hover:text-blue-600 transition-colors">
                  info@uin-antasari.ac.id
                </a>
              </li>
              <li className="flex text-base text-gray-600 items-center">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mr-3" strokeWidth={2} />
                <a href="tel:+62511-3256940" className="hover:text-blue-600 transition-colors">
                  (0511) 3256940
                </a>
              </li>
            </ul>
          </div>

          {/* Social and Legal */}
          <div className="space-y-10">
            {/* Social Media Links */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-5">
                IKUTI KAMI
              </h3>
              <div className="flex space-x-7 items-center mt-1">
                <a 
                  href="https://www.uin-antasari.ac.id/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label="Website UIN Antasari"
                >
                  <Globe size={22} strokeWidth={2} />
                </a>
                <a 
                  href="https://www.instagram.com/uinantasaribjm_official" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={22} strokeWidth={2} />
                </a>
                <a 
                  href="https://x.com/UINAntasariBJM" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label="X (formerly Twitter)"
                >
                  <X size={22} strokeWidth={2} />
                </a>
                <a 
                  href="https://www.youtube.com/c/uinantasaribanjarmasin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size={22} strokeWidth={2} />
                </a>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-6">
                LEGAL
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link 
                    to="/privacy-policy" 
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-[15px]"
                  >
                    <FileText size={16} className="text-gray-400 mr-2" strokeWidth={2} />
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms" 
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-[15px]"
                  >
                    <Shield size={16} className="text-gray-400 mr-2" strokeWidth={2} />
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            © {currentYear} UIN Antasari. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
import React from 'react';
import { Shield, Activity, Lock, Database, Eye } from 'lucide-react';

const DataSecurityInfo = () => {
  return (
    <div className="bg-surface-900 text-white rounded-xl overflow-hidden shadow-2xl">
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-4">Keamanan & Privasi</h2>
        
        <p className="text-surface-300 mb-8">
          Kami berkomitmen untuk menjaga keamanan data dan privasi responden
          dalam proses survei ini
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-900/30 rounded-full p-2 mt-1">
                <Shield className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Penyimpanan Aman</h3>
                <p className="text-surface-300 mt-1">
                  Data disimpan secara lokal di perangkat pengguna dan tidak dikirim
                  ke server eksternal
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary-900/30 rounded-full p-2 mt-1">
                <Activity className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Transparansi Penggunaan</h3>
                <p className="text-surface-300 mt-1">
                  Data hanya digunakan untuk tujuan peningkatan kualitas layanan dan
                  tidak akan dibagikan kepada pihak ketiga
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary-900/30 rounded-full p-2 mt-1">
                <Eye className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Akses Terbatas</h3>
                <p className="text-surface-300 mt-1">
                  Hanya administrator yang berwenang yang dapat melihat data hasil survei
                  sesuai dengan aturan privasi yang berlaku
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center items-center">
            <div className="relative">
              {/* Main image */}
              <div className="bg-surface-100/10 rounded-xl p-8 backdrop-blur-sm w-full max-w-sm">
                <div className="w-full aspect-square relative bg-gradient-to-tr from-primary-900/40 to-surface-800/30 rounded-xl flex items-center justify-center">
                  <Lock className="h-24 w-24 text-primary-400 opacity-90" strokeWidth={1} />
                  <div className="absolute -inset-0.5 rounded-xl border border-surface-500/20"></div>
                  
                  {/* Animated elements */}
                  <div className="absolute top-1/4 left-1/4 animate-ping-slow opacity-70">
                    <Database className="h-5 w-5 text-primary-500" />
                  </div>
                  <div className="absolute bottom-1/3 right-1/3 animate-ping-slow opacity-70" style={{ animationDelay: '1s' }}>
                    <Database className="h-4 w-4 text-primary-500" />
                  </div>
                  <div className="absolute top-1/3 right-1/4 animate-ping-slow opacity-70" style={{ animationDelay: '1.5s' }}>
                    <Database className="h-6 w-6 text-primary-500" />
                  </div>
                  
                  {/* Shield effect */}
                  <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent rounded-xl" style={{ animation: 'pulse 3s infinite' }}></div>
                </div>
              </div>
              
              {/* Background glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary-500/20 to-surface-700/5 rounded-full filter blur-xl opacity-70 -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSecurityInfo; 
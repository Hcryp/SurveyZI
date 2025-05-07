import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-500">404</h1>
        <h2 className="text-3xl font-display font-bold text-secondary-900 mt-4">Halaman Tidak Ditemukan</h2>
        <p className="text-secondary-600 mt-2 max-w-md mx-auto">
          Halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </p>
        <Link to="/" className="btn-primary mt-8 inline-flex items-center">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 
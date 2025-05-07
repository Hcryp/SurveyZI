import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Building, 
  BarChart2, 
  Lock, 
  CheckCircle, 
  ShieldCheck, 
  Activity
} from 'lucide-react';

const AboutPage = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="pt-32 pb-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariants}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl font-display font-bold tracking-tight text-secondary-900 sm:text-5xl">
          Tentang Sistem Survei
        </h1>
        <p className="mt-4 text-xl text-secondary-600 max-w-3xl mx-auto">
          Sistem Survei dan Direktori Layanan UIN Antasari dikembangkan untuk meningkatkan kualitas 
          layanan dan transparansi di lingkungan kampus
        </p>
      </motion.div>

      {/* Mission and Vision */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariants}
        transition={{ delay: 0.1 }}
        className="mx-auto max-w-7xl mb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-100 z-0"></div>
            <div className="relative z-10">
              <FileText className="h-10 w-10 text-primary-600 mb-4" />
              <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                Visi
              </h2>
              <p className="text-secondary-700">
                Menjadi pusat informasi pelayanan yang transparan, akuntabel, 
                dan berorientasi pada peningkatan kualitas layanan di UIN Antasari.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-accent-100 z-0"></div>
            <div className="relative z-10">
              <CheckCircle className="h-10 w-10 text-accent-600 mb-4" />
              <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                Misi
              </h2>
              <p className="text-secondary-700">
                Menyediakan platform yang memudahkan civitas akademika dan masyarakat 
                untuk memberikan umpan balik terhadap layanan di UIN Antasari, 
                serta menjamin akuntabilitas dan perbaikan layanan secara berkesinambungan.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariants}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-secondary-900">
            Fitur Utama
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Sistem ini dilengkapi dengan berbagai fitur untuk memberikan pengalaman terbaik
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-white p-6">
            <Building className="h-10 w-10 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Direktori Layanan
            </h3>
            <p className="text-secondary-600">
              Informasi lengkap tentang 28 unit layanan di UIN Antasari yang dapat diakses dengan mudah
            </p>
          </div>

          <div className="card bg-white p-6">
            <Users className="h-10 w-10 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Survei Anonim
            </h3>
            <p className="text-secondary-600">
              Responden dapat memberikan umpan balik secara anonim tanpa khawatir identitasnya terungkap
            </p>
          </div>

          <div className="card bg-white p-6">
            <BarChart2 className="h-10 w-10 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Analisis Data
            </h3>
            <p className="text-secondary-600">
              Data survei diolah menjadi informasi yang berguna untuk perbaikan layanan
            </p>
          </div>

          <div className="card bg-white p-6">
            <Lock className="h-10 w-10 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Keamanan Data
            </h3>
            <p className="text-secondary-600">
              Data disimpan dengan aman dan digunakan sesuai dengan tujuan survei
            </p>
          </div>
        </div>
      </motion.section>

      {/* Survey Process */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariants}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-secondary-900">
            Proses Survei
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Langkah-langkah sederhana untuk memberikan umpan balik
          </p>
        </div>

        <div className="relative">
          {/* Progress line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-100 transform -translate-x-1/2"></div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                <div className="bg-white p-6 rounded-2xl shadow-sm inline-block">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    Registrasi Anonim
                  </h3>
                  <p className="text-secondary-600">
                    Isi data demografis secara anonim untuk keperluan statistik
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center z-10 mx-4">
                <span className="text-xl font-bold text-primary-600">1</span>
              </div>
              <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center z-10 mx-4">
                <span className="text-xl font-bold text-primary-600">2</span>
              </div>
              <div className="md:w-1/2 md:pl-12 mb-4 md:mb-0">
                <div className="bg-white p-6 rounded-2xl shadow-sm inline-block">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    Pilih Layanan
                  </h3>
                  <p className="text-secondary-600">
                    Pilih unit layanan yang ingin Anda berikan umpan balik
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                <div className="bg-white p-6 rounded-2xl shadow-sm inline-block">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    Isi Survei
                  </h3>
                  <p className="text-secondary-600">
                    Berikan penilaian dan umpan balik terhadap layanan yang Anda pilih
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center z-10 mx-4">
                <span className="text-xl font-bold text-primary-600">3</span>
              </div>
              <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center z-10 mx-4">
                <span className="text-xl font-bold text-primary-600">4</span>
              </div>
              <div className="md:w-1/2 md:pl-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm inline-block">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    Kirim Survei
                  </h3>
                  <p className="text-secondary-600">
                    Setelah selesai, kirim survei Anda untuk diproses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Security and Privacy */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariants}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <div className="bg-secondary-900 rounded-3xl overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-display font-bold text-white mb-6">
                  Keamanan & Privasi
                </h2>
                <p className="text-secondary-300 mb-8">
                  Kami berkomitmen untuk menjaga keamanan data dan privasi responden dalam proses survei ini
                </p>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ShieldCheck className="h-6 w-6 text-primary-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">Penyimpanan Aman</h3>
                      <p className="mt-2 text-secondary-300">
                        Data disimpan secara lokal di perangkat pengguna dan tidak dikirim ke server eksternal
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Activity className="h-6 w-6 text-primary-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">Transparansi Penggunaan</h3>
                      <p className="mt-2 text-secondary-300">
                        Data hanya digunakan untuk tujuan peningkatan kualitas layanan dan tidak akan dibagikan kepada pihak ketiga
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/security.png" 
                  alt="Data Security"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo_uin.png';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Team */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariants}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-secondary-900">
            Tim Pengembang
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Sistem ini dikembangkan oleh tim dari UIN Antasari
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex flex-col items-center">
            <p className="text-center text-secondary-700 max-w-3xl mx-auto">
              Sistem Survei dan Direktori Layanan UIN Antasari dikembangkan oleh mahasiswa 
              Fakultas Tarbiyah dan Keguruan UIN Antasari Banjarmasin. Pengembangan sistem ini 
              merupakan bagian dari upaya untuk meningkatkan kualitas pelayanan dan mewujudkan 
              transparansi di lingkungan kampus UIN Antasari.
            </p>
            <div className="mt-8">
              <a
                href="https://uin-antasari.ac.id"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Kunjungi Website UIN Antasari
              </a>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage; 
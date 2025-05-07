// ServiceDirectory.tsx
import React from 'react';
import { QRCode } from 'react-qr-code';
import styles from './ServiceDirectory.module.css';

const serviceUnits = [
  { id: 1, name: "Kantor Akademik", description: "Unit akademik utama", location: "Gedung A", status: "Active" },
  // ... 27 more units
];

const ServiceDirectory = () => {
  return (
    <div className={styles.directory}>
      <input type="text" placeholder="Search units..." className={styles.searchInput} />
      
      <div className={styles.unitList}>
        {serviceUnits.map(unit => (
          <div key={unit.id} className={styles.unitCard}>
            <QRCode 
              value={`https://uinantasku.com/survey/${unit.id}`}
              size={128}
              className={styles.qrCode}
            />
            <h3>{unit.name}</h3>
            <p>{unit.description}</p>
            <small>Location: {unit.location}</small>
            <span className={styles.statusBadge}>{unit.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDirectory;
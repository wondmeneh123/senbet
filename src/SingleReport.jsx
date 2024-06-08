import React, { useRef, useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import './component/SideBar.css';
import './PDFCss.css'; 
import Logo from './assets/logo.jpg';
import eotc from './assets/eotc.jpg';

const SingleReport = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const componentRef = useRef();

  useEffect(() => {
    const getUser = async () => {
      try {
        const userDoc = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUser(userSnapshot.data());
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
  }, [userId]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'User Details',
    pageStyle: `
      @page {
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Attendance Report',
    pageStyle: `
      @page {
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `
  });

  return (
    <div ref={componentRef}>
      <div className="header">
        <img src={Logo} alt="Logo" className="logo" />
        <h1>Attendance Report</h1>
      </div>
      <div className="attendance-details">
        <table className="attendance-table">
          <tbody>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
            {attendance.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td> {/* Assuming date is a property of each attendance entry */}
                <td>{entry.status}</td> {/* Assuming status is a property of each attendance entry */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handlePrint}>Print</button>
    </div>
};

export default SingleReport;
  
import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { db } from './firebaseConfig'; // Import db
import { collection, getDocs } from 'firebase/firestore';
import SideBar from './component/SideBar';
import './component/SideBar.css';
import './Snk.css';
import Logo from './assets/logo.jpg';
import eotc from './assets/eotc.png';
import Barcode from 'react-barcode';

const IDCard = () => {
  const [students, setStudents] = useState([]);
  const componentRef = useRef();
  const backRef = useRef();

  useEffect(() => {
    const getStudents = async () => {
      try {
        const studentCollection = collection(db, "users");
        const data = await getDocs(studentCollection);
        const fetchedStudents = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setStudents(fetchedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    getStudents();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'ID Cards',
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

  const handleBackPrint = useReactToPrint({
    content: () => backRef.current,
    documentTitle: 'Back ID Cards',
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
    <div className="hm">
      <SideBar />
      <div className="wrapPf pf">
        <div className="hd">
          <h1>ID Cards</h1>
        </div>
        <div className="id" ref={componentRef}>
          {students.map(stud => (
            <div key={stud.id} className="idwrap">
              <div className="header m">
                <img src={eotc} className="right" alt="Logo" />
                <h4 className="name">በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን በድሬዳዋ ሃ/ስብከት የመንበረ ብርሃን ቅ/ሥላሴ ገዳም ውሉደ ብርሃን ሰንበት ት/ቤት</h4>
                <img src={Logo} className="left" alt="EOTC" />
              </div>
              <div className="infof">
                <div className="pho">
                  <img className="pp" src={stud.photoUrl} alt="Profile" />
                </div>
                <div className="info">
                  <p><b>ስም: </b>{stud.firstName} {stud.lastName}</p>
                  <p><b>ክፍል: </b>{stud.age}</p>
                  <p><b>መለያ: </b>{stud.address}</p>
                  <Barcode
                    value={`senbet.vercel.app/${stud.id}`}
                    displayValue={false}
                    className="bar"
                    background="#9dc8ed"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handlePrint} className="print-button">Print Front</button>
      </div>
      <div className="wrapPf pf">
        <div className="hd">
          <h1>Back ID Cards</h1>
        </div>
        <div className="id" ref={backRef}>
          {students.map(stud => (
            <div key={stud.id} className="idwrap">
              <div className="back-content">
                <div className="backhd">
                  <img src={Logo} />
                  <h2>ውሉደ ብርሃን</h2>
                </div>
                <div className="backmn">
              <p>
              ሁለት ወይም ሦስት በስሜ<br /> በሚሰበሰቡበት በዚያ በመካከላቸው እሆናለሁ<span>የማቴዎስ ወንጌል 18</span>
              </p>
                </div>
                <div className="backend">
                  <div className='links'>
                    
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleBackPrint} className="print-button">Print Back</button>
      </div>
    </div>
  );
};

export default IDCard;

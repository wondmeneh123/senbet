import React, { useRef, useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import './component/SideBar.css';
import './PDFCss.css'; 
import Logo from './assets/logo.jpg';
import eotc from './assets/eotc.png';

const ViewUser = () => {
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

  return (
    <div className="wrp">
      <div className="profile-container" ref={componentRef}>
        <div className="header">
          <img src={Logo} className="right" alt="Logo" />
          <h4>በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን በድሬዳዋ ሃ/ስብከት የመንበረ ብርሃን ቅ/ሥላሴ ገዳም ውሉደ ብርሃን ሰንበት ት/ቤት</h4>
          <img src={eotc} className="left" alt="EOTC" />
        </div>
        <div className="pppp">
          <img src={user.photoUrl} alt="Profile" className="profile-pic" />
          <br />
         

          
          <div className="grp">
          <p><span>ስም:</span> {user.firstName} {user.lastName}</p>
          <p><span>እድሜ:</span> {user.age}</p>
         
           <p><span>ጾታ:</span> {user.sex}</p>
           </div>
            <div className="grp">
                        <p><span>አድራሻ:</span> {user.address}</p>

          <p><span>ስልክ ቁጥር፡ </span> {user.phoneNumber}</p>
          
          </div>
          <p><span>ኢሜይል:</span> {user.email}</p>
          <p><span>የክርስትና ስም:</span> {user.chrstianName}</p>
          <p><span>የአባልነት አይነት:</span> {user.memberType}</p>
         <p><span>የአገልግሎት ክፍል:</span> {user.giveService}</p>
                   <p><span>የስራ ድርሻ:</span> {user.positon}</p>

          <p><span>የስራ ሁኔታ:</span> {user.jobStatus}</p>
                <div className="grp">
          <p><span>የአደጋ ጊዜ ተጠሪ</span><span> ስም:</span> {user.emergencyName}     <span style={{marginLeft: "30px"}}>ስልክ ቁጥር: </span>{user.emergencyContact}</p>
          
                </div>
          <p><span>{user.religionBefore ? 'ከዚህ በፊት የተለየ ሃይማኖት ተከታይ ነበረ/ች' : 'ከዚህ በፊት የተለየ ሃይማኖት ተከታይ አልነበረም/ችም'}</span></p>
          <p>{user.senbetBefore ? 'ከዚህ በፊት ሰንበት ተማሪ ነበረ/ች' : 'ከዚህ በፊት ሰንበት ተማሪ አልነበረም/ችም'}</p>
          <p><span>ሰ/ት/ቤት የገባበት ምክንያት </span><br />  {user.reason}</p>
          <p><span>ቅጹ የተሞላበት ቀን:</span> {user.date}</p>
          <p><span>ቅጹን ያስሞላው አካል፡ </span> {user.associatedBy}</p>
        </div>
        <div className="signature">
               
<p><span>የሰ/ት/ቤቱ ሰብሳቢ ስም እና ፊርማ</span><br /> {user.presideant}</p>
        </div>
      </div>
      <button onClick={handlePrint} className="print-button">Print/Save as PDF</button>
    </div>
  );
};

export default ViewUser;
  
import React, { useRef, useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import './component/SideBar.css';
import './PDFCss.css';
import Logo from './assets/logo.jpg';
import eotc from './assets/eotc.png';
import { FaRegLightbulb } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { FaRegQuestionCircle } from "react-icons/fa";
import { GiPunch } from "react-icons/gi";
import SideBar from './component/SideBar'
import { FaLocationArrow } from "react-icons/fa";

const Transcript = () => {
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
    <div className="hm">
      <SideBar />
      <div className='wrapPf pf'>
        <div className="hd">
          <h1>የ {user.firstName} {user.lastName} ነባራዊ ሁኔታ</h1>
        </div>

        <div className="infoWrapper">
          <h2>አባሉ የጨረሳቸው ትምህርቶች</h2>
          <div className="single">
            {user.courses ? (

              user.courses.map((course, index) => (
                <div key={index} className="dd">

                  <div>
                    <FaRegLightbulb className="ic" />
                    <h4>የትምህርቱ ስም: </h4>
                    <p>{course.name}</p>
                  </div>
                  <div>
                    <MdOutlineDateRange />
                    <h4>ያለቀበት ቀን:</h4>
                    <p>{course.when}</p>

                  </div>
                </div>
              ))

            ) : (
              <p>No Courses for this member</p>
            )}

          </div>
          <h2>አባሉ የተቀጡባቸው አጋጣሚዎች</h2>
          <div className="single">
            {user.punishment ? (

              user.punishment.map((pun, index) => (
                <div key={index} className="dd">

                  <div>
                    <FaRegQuestionCircle />
                    <h4>የተቀጡበት ምክንያት: </h4>
                    <p>{pun.reason}</p>
                  </div>
                  <div>
                    <GiPunch />
                    <h4>የተቀጡት ቅጣት:</h4>
                    <p>{pun.punishment}</p>

                  </div>
                </div>
              ))

            ) : (
              <p>No punishment</p>
            )}

          </div>
          <h2>አባሉ ፈቃድ የወሰደባቸው ጊዜዎች</h2>
          <div className="single">
            {user.permission ? (

              user.permission.map((per, index) => (
                <div key={index} className="dd">

                  <div>
                    <FaRegLightbulb className="ic" />
                    <h4>የፈቃድ ምክንያት: </h4>
                    <p>{per.reason}</p>
                  </div>
                  <div>
                    <MdOutlineDateRange />
                    <h4>የፈቃዱ ቆይታ:</h4>
                    <p>ከ {per.startDate} እስከ {per.finishDate}</p>
                  </div>
                </div>
              ))

            ) : (
              <p>No permission</p>
            )}

          </div>
          <h2>አባሉ የከፈላቸው የወር ክፍያዎች</h2>
          <div className="single">
            {user.fee ? (
              <div className="dd">
                <table>
                  <thead>
                    <tr>
                      <th>ተራ ቁ.</th>
                      <th>የክፍያ መጠን</th>
                      <th>ወር</th>
                      <th>ዓ/ም</th>
                     
                    </tr>
                  </thead>
                  <tbody>
                    {user.fee.map((fee, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{fee.amount}</td>
                        <td>{fee.month}</td>
                        <td>{fee.year}</td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No fee record!</p>
            )}
          </div>

          <h2>የአባሉ ትክክለኛ አድራሻ</h2>
          {user.location ? (
            <>

              <div className="single">
                <div className="dd">
                  <div>
                    <FaLocationArrow />
                    <a href={`${user.location}`}>

                      <p>አድራሻውን ለማየት ይሄን ይጫኑ</p>
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>No location</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Transcript;

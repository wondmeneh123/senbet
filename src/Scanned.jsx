import React, { useRef, useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import './component/SideBar.css';
import './PDFCss.css';
import Logo from './assets/logo.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Scanned = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const componentRef = useRef();
  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getCurrentDate);

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

  const handleAttendanceClick = async () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }

    try {
      const attendanceDocRef = doc(db, 'attendance', selectedDate);
      const attendanceSnapshot = await getDoc(attendanceDocRef);

      let presentMembers = [];
      if (attendanceSnapshot.exists()) {
        presentMembers = attendanceSnapshot.data().presentMembers || [];
      }

      const newMemberName = `${user.firstName} ${user.lastName}`;
      if (!presentMembers.includes(newMemberName)) {
        presentMembers.push(newMemberName);
      }

      await setDoc(attendanceDocRef, { presentMembers }, { merge: true });

      const memberDocRef = doc(db, 'users', userId);
      await updateDoc(memberDocRef, {
        [`attendance.${selectedDate}`]: 'present'
      });

       toast.success('አባሉ/ሏ ተገኝተዋል');
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Failed to submit attendance. Please try again.');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ll">
      <img className="logo" src={Logo} />
      <div className="scanned">
        <div>
          <img src={user.photoUrl} alt="User" />
          <div className='s'>
            <p><b>ስም፡ </b> {user.firstName} {user.lastName} </p>
            <p><b>ጾታ፡ </b> {user.sex}</p>
            <p><b>የአባል አይነት: </b>{user.memberType}</p>
          </div>
           <button onClick={handleAttendanceClick}>Mark Present</button>
        </div>
       
      </div>
      <ToastContainer />
    </div>

  );
};

export default Scanned;

import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import SideBar from './component/SideBar';
import './AttendanceSystem.css';
import Modal from 'react-modal';
import { useReactToPrint } from 'react-to-print';

const AttendanceSystem = () => {
  const componentRef = useRef();
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const memberCollection = collection(db, 'users');
        const memberSnapshot = await getDocs(memberCollection);
        const memberList = memberSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMembers(memberList);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  const handleAttendanceChange = memberId => {
    setAttendance(prevAttendance => ({
      ...prevAttendance,
      [memberId]: !prevAttendance[memberId]
    }));
  };

  const handleModal = async () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }

    try {
      const attendanceDocRef = doc(db, 'attendance', selectedDate);
      const attendanceDoc = await getDoc(attendanceDocRef);

      if (attendanceDoc.exists()) {
        setReport(attendanceDoc.data());
      } else {
        setReport(null);
        alert('No attendance data found for the selected date.');
      }

      setModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      alert('Failed to fetch attendance data. Please try again.');
    }
  };

  const handleDateChange = event => {
    setSelectedDate(event.target.value);
  };

  const handleSubmitAttendance = async () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }

    const presentMembers = members.filter(member => attendance[member.id]);

    try {
      const attendanceDocRef = doc(db, 'attendance', selectedDate);
      await setDoc(attendanceDocRef, { presentMembers: presentMembers.map(member => `${member.firstName} ${member.lastName}`) }, { merge: true });

      const updateMemberAttendance = async member => {
        const memberDocRef = doc(db, 'users', member.id);
        await updateDoc(memberDocRef, {
          [`attendance.${selectedDate}`]: attendance[member.id] ? 'present' : 'absent'
        });
      };

      await Promise.all(members.map(updateMemberAttendance));

      alert('Attendance submitted successfully!');
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Failed to submit attendance. Please try again.');
    }
  };

  return (
    <div className="hm">
      <SideBar />

      <div className="wrapPf pf">
        <div className="hd">
          <h1>Attendance</h1>
        </div>
        <div className="date-picker">
          <label htmlFor="attendance-date">Select Date:</label>
          <input
            type="date"
            id="attendance-date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="member-list">
          <div className="report-modal" ref={componentRef}>
            <h3>የ አቴንዳንስ ሪፖርት</h3>
            <p style={{ marginBottom: "30px" }}><b>በ {selectedDate} የተገኙ አባላት</b></p>
            <table className="tt">
              <thead>
                <tr>
                  <th>ተራ ቁጥር</th>
                  <th>የአባሉ ስም</th>
                </tr>
              </thead>
              <tbody>
                {report ? (
                  report.presentMembers.map((member, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{member}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No data available for the selected date.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <div style={{ display: "flex" }}>
        <button onClick={handlePrint} className="print-button">Print/Save as PDF</button>

        <button className="submit-button" onClick={handleModal}>Generate attendance report</button>
      </div>
    </div>
  );
};

export default AttendanceSystem;

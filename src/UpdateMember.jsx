import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from './firebaseConfig';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import SideBar from './component/SideBar';
import './Snk.css';

const UpdateMember = () => {
  const { userId } = useParams();
  const [location, setLocation] = useState("");
  const [userInfo, setUserInfo] = useState({
    courses: [{ name: '', when: '' }],
    punishment: [{ reason: '', punishment: '' }],
    fee: [{ status: true, amount: 0, month: '', year: '' }],
    permission: [{ reason: '', startDate: '', finishDate: '' }],
  });

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    setUserInfo(prevState => ({
      ...prevState,
      fee: prevState.fee.map(f => ({ ...f, month: currentMonth, year: currentYear }))
    }));
  }, []);

  const handleChange = (section, index, event) => {
    const { name, value } = event.target;
    const updatedSection = [...userInfo[section]];
    updatedSection[index][name] = value;
    setUserInfo({
      ...userInfo,
      [section]: updatedSection
    });
  };

  const handleSubmit = async (section) => {
    const isEmpty = (entry) => Object.values(entry).some(value => typeof value === 'string' && value.trim() === '');
    const sectionValid = userInfo[section].every(item => !isEmpty(item));
  
    if (!sectionValid) {
      console.error(`Some fields in ${section} are empty. Please fill in all fields before submitting.`);
      return;
    }
  
    try {
      const userDoc = doc(db, 'users', userId);
      const newData = userInfo[section].map(item => arrayUnion(item));
      
      await updateDoc(userDoc, {
        [section]: arrayUnion(...userInfo[section])
      });
      console.log(`${section.charAt(0).toUpperCase() + section.slice(1)} info updated successfully`);
    } catch (error) {
      console.error(`Error updating ${section} info:`, error);
    }
  };
  const handleLocationSubmit = async () => {
    if (location.trim() === '') {
      console.error('Location field is empty. Please fill in the location before submitting.');
      return;
    }

    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, { location });
      console.log('Location updated successfully');
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const addCourse = () => {
    setUserInfo({
      ...userInfo,
      courses: [...userInfo.courses, { name: '', when: '' }]
    });
  };

  const addFee = () => {
    setUserInfo({
      ...userInfo,
      fee: [...userInfo.fee, { status: true, amount: 0, month: '', year: '' }]
    });
  };

  const addPermission = () => {
    setUserInfo({
      ...userInfo,
      permission: [...userInfo.permission, { reason: '', startDate: '', finishDate: '' }]
    });
  };

  const addPunish = () => {
    setUserInfo({
      ...userInfo,
      punishment: [...userInfo.punishment, { reason: '', punishment: '' }]
    });
  };

  return (
    <div className="hm">
      <div className="sidebar">
        <SideBar />
      </div>
      <div className="wrapPf pf">
        <div className="hd">
          <h1>ተጨማሪ መረጃዎች</h1>
        </div>
        <div className="kii">
          <div className="section">
            <h2>ትምህርቶች</h2>
            <form onSubmit={(event) => { event.preventDefault(); handleSubmit('courses'); }}>
              {userInfo.courses.map((course, index) => (
                <div className="form-row" key={index}>
                  <div>
                    <label>የትምህርቱ ስም</label>
                    <input
                      name="name"
                      value={course.name}
                      onChange={(event) => handleChange('courses', index, event)}
                      placeholder="የትምህርቱ ስም"
                    />
                  </div>
                  <div>
                    <label>ትምህርቱ ያለቀበት ቀን</label>
                    <input
                      type="date"
                      name="when"
                      value={course.when}
                      onChange={(event) => handleChange('courses', index, event)}
                      placeholder="Date"
                    />
                  </div>
                </div>
              ))}
              <button type="submit">ትምህርቱን አስገባ</button>
            </form>
          </div>

          <div className="section">
            <h2>ፈቃድ</h2>
            <form className="dddd" onSubmit={(event) => { event.preventDefault(); handleSubmit('permission'); }}>
              {userInfo.permission.map((permission, index) => (
                <div className="form-row" key={index}>
                  <div>
                    <label>ምክንያት</label>
                    <input
                      name="reason"
                      value={permission.reason}
                      onChange={(event) => handleChange('permission', index, event)}
                      placeholder="ምክንያት"
                    />
                  </div>
                  <div>
                    <label>የሚጀምርበት ቀን</label>
                    <input
                      type="date"
                      name="startDate"
                      value={permission.startDate}
                      onChange={(event) => handleChange('permission', index, event)}
                      placeholder="Start Date"
                    />
                  </div>
                  <div>
                    <label>የሚያበቃበት ቀን</label>
                    <input
                      type="date"
                      name="finishDate"
                      value={permission.finishDate}
                      onChange={(event) => handleChange('permission', index, event)}
                      placeholder="Finish Date"
                    />
                  </div>
                </div>
              ))}
              <button type="submit">ፈቃድ አስገባ</button>
            </form>
          </div>

          <div className="section">
            <h2>ቅጣት</h2>
            <form onSubmit={(event) => { event.preventDefault(); handleSubmit('punishment'); }}>
              {userInfo.punishment.map((punishment, index) => (
                <div className="form-row" key={index}>
                  <div>
                    <label>ምክንያት</label>
                    <input
                      name="reason"
                      value={punishment.reason}
                      onChange={(event) => handleChange('punishment', index, event)}
                      placeholder="ምክንያት"
                    />
                  </div>
                  <div>
                    <label>ቅጣት</label>
                    <input
                      type="text"
                      name="punishment"
                      value={punishment.punishment}
                      onChange={(event) => handleChange('punishment', index, event)}
                      placeholder="Punishment"
                    />
                  </div>
                </div>
              ))}
              <button type="submit">ቅጣት አስገባ</button>
            </form>
          </div>

          <div className="section">
            <h2>ክፍያ</h2>
            <form onSubmit={(event) => { event.preventDefault(); handleSubmit('fee'); }}>
              {userInfo.fee.map((fee, index) => (
                <div className="form-row" key={index}>
                  <div>
                    <label>Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={fee.amount}
                      onChange={(event) => handleChange('fee', index, event)}
                      placeholder="Amount"
                    />
                  </div>
                  <div>
                    <label>Month</label>
                    <input
                      type="text"
                      name="month"
                      value={fee.month}
                      onChange={(event) => handleChange('fee', index, event)}
                      placeholder="Month"
                    />
                  </div>
                  <div>
                    <label>Year</label>
                    <input
                      type="text"
                      name="year"
                      value={fee.year}
                      onChange={(event) => handleChange('fee', index, event)}
                      placeholder="Year"
                    />
                  </div>
                </div>
              ))}
              <button type="submit">ክፍያ አስገባ</button>
            </form>
          </div>

          <div className="section">
            <h2>አድራሻ</h2>
            <input
              className="location-input"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button className="location-button" onClick={handleLocationSubmit}>አድራሻን አስገባ</button>
          </div>
          <div className="section">
            <Link to={`/transcript/${userId}`}>
              <button>ሙሉ መረጃን ለማየት</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateMember;

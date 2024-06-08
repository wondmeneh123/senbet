import React, { useState, useEffect } from 'react';
import { auth, db, storage } from './firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import SideBar from './component/SideBar';
import './component/SideBar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Register = () => {
  const notifySuccess = () => {
    toast.success('Operation successful!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000, // Auto close after 5 seconds
    });
  };

  const [info, setInfo] = useState({
    firstName: '',
    lastName: '',
    age: '',
    address: '',
    chrstianName: '',
    phoneNumber: '',
    email: '',
    password: '12345678',
    sex: '',
    memberType: 'ወጣት',
    photoUrl: '',
    jobStatus: '',
    motherName: '',
    emergencyName: '',
    emergencyContact: '',
    educationLevel: '',
    religionBefore: false,
    date: '',
    associatedBy: '',
    reason: '',
    senbetBefore: false,
    presideant: 'ማህሌት አይችሉህም',
    giveService: '',
    positon: '',
  });

  const [families, setFamilies] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'families'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFamilies(data);
      } catch (error) {
        console.error('Error fetching families:', error);
      }
    };
    fetchFamilies();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const generateRandomNumber = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const storageRef = ref(storage, `userProfileImages/${info.email}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);
      const randomId = generateRandomNumber();

      const idStr = randomId.toString()
      await setDoc(doc(db, "users", idStr), {
        id: idStr,
        firstName: info.firstName,
        lastName: info.lastName,
        age: info.age,
        address: info.address,
        phoneNumber: info.phoneNumber,
        email: info.email,
        photoUrl: imageUrl,
        chrstianName: info.chrstianName,
        sex: info.sex,
        memberType: info.memberType,
        jobStatus: info.jobStatus,
        emergencyName: info.emergencyName,
        emergencyContact: info.emergencyContact,
        educationLevel: info.educationLevel,
        religionBefore: info.religionBefore,
        date: info.date,
        associatedBy: info.associatedBy,
        reason: info.reason,
        presideant: info.presideant,
        senbetBefore: info.senbetBefore,
        giveService: info.giveService,
        positon: info.positon,
      });

      setInfo({
        firstName: '',
        lastName: '',
        age: '',
        address: '',
        phoneNumber: '',
        email: '',
        password: '', // Reset password field
        sex: '',
        memberType: 'ወጣት',
        photoUrl: '',
        jobStatus: '',
        motherName: '',
        emergencyName: '',
        emergencyContact: '',
        educationLevel: '',
        religionBefore: '',
        date: '',
        associatedBy: '',
      });
      toast.success('አባል በተሳካ ሁኔታ ተመዝግቧል');

    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <>
      <div className="hm">
        <SideBar />
        <div className='wrapPf pf'>
          <div className="hd">
            <h1>አዲስ አባል መመዝገቢያ</h1>
          </div>
          <form className="formContainer" onSubmit={handleSubmit}>

            <div className="formGroup">

              <label>ስም</label>
              <input
                type="text"
                placeholder="ስም"
                name="firstName"
                value={info.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label>የአባት ስም</label>
              <input
                type="text"
                placeholder="የአባት ስም"
                name="lastName"
                value={info.lastName}
                onChange={handleChange}
                required
              />
            </div>


            <div className="formGroup">
              <label>እድሜ</label>
              <input
                type="number"
                placeholder="እድሜ"
                name="age"
                value={info.age}
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label>አድራሻ</label>
              <input
                type="text"
                placeholder="አድራሻ"
                name="address"
                value={info.address}
                onChange={handleChange}
              />
            </div>

            <div className="formGroup">
              <label>ስልክ ቁጥር</label>
              <input
                type="text"
                placeholder="ስልክ ቁጥር"
                name="phoneNumber"
                value={info.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="formGroup">
              <label>ኢሜይል</label>
              <input
                type="email"
                placeholder="ኢሜይል"
                value={info.email}
                name="email"
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label>የክርስትና ስም</label>
              <input
                type="text"
                placeholder="የክርስትና ስም"
                name="chrstianName"
                value={info.chrstianName}
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label>ጾታ</label>
              <select
                name="sex"
                value={info.sex}
                onChange={handleChange}
              >
                <option value="">Select sex</option>
                <option value="ወንድ">ወንድ</option>
                <option value="ሴት">ሴት</option>
              </select>
            </div>
            <div className="formGroup">
              <label>የስራ ሁኔታ</label>
              <select
                name="jobStatus"
                value={info.jobStatus}
                onChange={handleChange}
              >
                <option value="">የስራ ሁኔታ</option>
                <option value="ሰራተኛ">ሰራተኛ</option>
                <option value="ተማሪ">ተማሪ</option>
              </select>
            </div>
            <div className="formGroup">
              <label>የአደጋ ጊዜ ተጠሪ ስም</label>
              <input
                type="text"
                placeholder="የአደጋ ጊዜ ተጠሪ ስም"
                name="emergencyName"
                value={info.emergencyName}
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label>የአደጋ ጊዜ ተጠሪ ስልክ</label>
              <input
                type="text"
                placeholder="የአደጋ ጊዜ ተጠሪ ስልክ"
                name="emergencyContact"
                value={info.emergencyContact}
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label>የትምህርት ደረጃ</label>
              <select
                name="educationLevel"
                value={info.educationLevel}
                onChange={handleChange}
              >
                <option value="">የትምህርት ደረጃ</option>
                <option value="የመጀመሪያ ደረጃ">የመጀመሪያ ደረጃ</option>
                <option value="ሁለተኛ ደረጃ">ሁለተኛ ደረጃ</option>
                <option value="ኮሌጅ">ኮሌጅ</option>
              </select>
            </div>

            <div className="formGroup">
              <label>የአገልግሎት ክፍል</label>
              <select
                name="giveService"
                value={info.giveService}
                onChange={handleChange}
              >
                <option value="አባል">አባል</option>
                <option value="ዘማሪ">ዘማሪ</option>

                <option value="ሰብሳቢ">ሰብሳቢ</option>
                <option value="ጸሃፊ">ጸሃፊ</option>
                <option value="መዝሙር">መዝሙር</option>
                <option value="ኪነጥበብ">ኪነጥበብ</option>
                <option value="ልማት">ልማት</option>
                <option value="አባላት እና ግንኙነት">አባላት እና ግንኙነት</option>
                <option value="ህጻናት እና ታዳጊ">ህጻናት እና ታዳጊ</option>
              </select>
            </div>

            <div className="formGroup">
              <label>የስራ ድርሻ</label>
              <select
                name="positon"
                value={info.positon}
                onChange={handleChange}
              >
                <option value="">የስራ ድርሻ</option>
                <option value="አባል">አባል</option>
                <option value="የክፍል ተጠሪ">የክፍል ተጠሪ</option>
                <option value="ንዑስ">ንዑስ</option>

              </select>
            </div>

            <div className="formGroup">
              <label>የሌላ ሃይማኖት ተከታይ ነበርክ/ሽ ?</label>
              <select
                name="religionBefore"
                value={info.religionBefore}
                onChange={handleChange}
              >
                <option value="">የሌላ ሃይማኖት ተከታይ ነበርክ/ሽ ?</option>
                <option value={true}>አዎ</option>
                <option value={false}>አይ</option>
              </select>
            </div>
            <div className="formGroup">
              <label>ከዚህ በፊት ሰንበት ተማሪ ነበርክ/ሽ?</label>
              <select
                name="senbetBefore"
                value={info.senbetBefore}
                onChange={handleChange}
              >
                <option value="">ከዚህ በፊት ሰንበት ተማሪ ነበርክ/ሽ?</option>
                <option value={true}>አዎ</option>
                <option value={false}>አይ</option>
              </select>
            </div>
            <div className="formGroup">
              <label>ሰ/ት/ቤት ለመግባት የፈለግህበት/ሽበት ምክንያት</label>
              <textarea
                type="text"
                placeholder="ሰ/ት/ቤት ለመግባት የፈለግህበት/ሽበት ምክንያት"
                name="reason"
                value={info.reason}
                onChange={handleChange}

              >
              </textarea>
            </div>
            <div className="formGroup">
              <label>ቅጹ የተሞላበት ቀን</label>
              <input
                type="date"
                placeholder="ቅጹ የተሞላበት ቀን"
                name="date"
                value={info.date}
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label>ቅጹን ያስሞላው አካል</label>
              <input
                type="text"
                placeholder="ቅጹን ያስሞላው አካል"
                name="associatedBy"
                value={info.associatedBy}
                onChange={handleChange}
              />
            </div>

            {/* <div className="formGroup">
        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={info.password}
          onChange={handleChange}
          required
        />
      </div>*/}
            <div className="formGroup">
              <label>የአባል ፎቶ</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <button type="submit" className="sign">መዝግብ</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;

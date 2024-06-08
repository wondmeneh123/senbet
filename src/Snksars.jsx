import { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; // Import db
import { collection, query, getDocs, orderBy, limit, startAfter, startAt } from 'firebase/firestore';
import { Link } from 'react-router-dom'; // Import Link component
import SideBar from './component/SideBar';
import './component/SideBar.css';
import './Snk.css';
import { FaEye } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { FaFile } from "react-icons/fa";

const UserList = () => {
  const [students, setStudents] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [prevDocs, setPrevDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async (direction = 'initial') => {
    setLoading(true);
    try {
      const studentCollection = collection(db, "users");
      let q = query(studentCollection, orderBy("lastName"), limit(5));

      if (direction === 'next' && lastDoc) {
        q = query(studentCollection, orderBy("lastName"), startAfter(lastDoc), limit(5));
      } else if (direction === 'prev' && firstDoc && prevDocs.length > 0) {
        const prevDoc = prevDocs.pop();
        setPrevDocs(prevDocs);
        q = query(studentCollection, orderBy("lastName"), startAt(prevDoc), limit(5));
      }

      const data = await getDocs(q);
      const fetchedStudents = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      
      if (direction === 'next') {
        setPrevDocs([...prevDocs, firstDoc]);
      }
      
      setStudents(fetchedStudents);
      setFirstDoc(data.docs[0]);
      setLastDoc(data.docs[data.docs.length - 1]);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      <div className="hm">
        <SideBar />
        <div className='wrapPf pf'>
          <div className="hd">
            <h1>የ ሰ/ት/ቤቱ አባላት</h1>
          </div>
          <div className="mm">
            <table>
              <thead>
                <tr>
                  <th>ተራ ቁ.</th>
                  <th>ፎቶ</th>
                  <th>ስም</th>
                  <th>እድሜ</th>
                  <th>አድራሻ</th>
                  <th>ኢሜይል</th>
                  <th>ጾታ</th>
                  <th>Action</th> 
                </tr>
              </thead>
              <tbody>
                {students.map((stud,index) => (
                  <tr key={stud.id}>
                  <td>{index+1}</td>
                    <td className='pho'><img src={stud.photoUrl} alt="student" /> </td>
                    <td>{stud.firstName} {stud.lastName}</td>
                    <td>{stud.age}</td>
                    <td>{stud.address}</td>
                    <td>{stud.email}</td>
                    <td>{stud.sex}</td>
                    <td style={{ display: "flex", gap: "10px" }}>
                      <Link to={`/members/${stud.id}`} style={{ color: "#000" }}>
                        <FaEye className="icon" />
                      </Link>
                      <Link to={`/update/${stud.id}`} style={{ color: "#000" }}>
                        <GrUpdate className="icon" />
                      </Link>
                      <Link to={`/transcript/${stud.id}`} style={{ color: "#000" }}>
                        <FaFile className="icon" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button onClick={() => fetchStudents('prev')} disabled={loading || prevDocs.length === 0}>
                Previous
              </button>
              <button onClick={() => fetchStudents('next')} disabled={loading}>
                {loading ? 'Loading...' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;

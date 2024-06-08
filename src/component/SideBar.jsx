import { Link } from 'react-router-dom';
import { sidebars } from './SidBarData';
import './SideBar.css'
import { AiFillHome } from "react-icons/ai";
import Logo from '../assets/logo.jpg'
const SideBar = () => { 
    return (
        <div className="sidebar">
        <div className="logoo">
       <img src={Logo} />
       <h3>ውሉደ ብርሃን ሰንበት ት/ቤት</h3>      
       </div>
            {sidebars.map((val) => {
                return (
                    <ul className="lists" key={val.id}>
                        <li
                        >
               <Link to={`/${val.link}`} className="row"
                            id={window.location.pathname === `/${val.link}` ? 'active' : ''}>
                                <div id="icon">
                                    {val.icon}
                                </div>
                                <div id="tit">{val.title}</div>

                            </Link>
                        </li>
                    </ul>
                );
            })}
        </div>
    );
};

export default SideBar;

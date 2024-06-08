import { MdOutlineHome } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { TiGroup } from "react-icons/ti";
import { BsCalendarEvent } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { GoInfo } from "react-icons/go";

export const sidebars = [

{
	id: 1,
	title: 'አባል ጨምር',
	icon: <MdOutlineHome />,
	link: 'register'
	
},
{
	id: 2,
	title: 'አባላት',
	icon: <CgProfile />,
	link: 'members'

	
},

{
	id: 3,
	title: 'መታወቂያ',
	icon: <TiGroup />,
	link: 'idcard'
	
	
},

{
	id: 4,
	title: 'አቴንዳንስ',
	icon: <BsCalendarEvent />,
	link: 'attendance'
	
},




// {
// 	id: 5,
// 	title: 'Sugesstion',
// 	icon: <FaRegComment />,
// 	link: 'suggest'
	
	
// },
// {
// 	id: 6,
// 	title: 'Snksars',
// 	icon: <IoBookOutline />,
// 	link: 'snksar'
// },

// {
// 	id: 7,
// 	title: 'About',
// 	icon: <GoInfo />,
// 	link: 'about'
	
	
// },

]
import './Login.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.jpg';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth'


const Login = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const navigate = useNavigate()
	useEffect(() => {
		document.title = "Login to Wlude brhan"
	}, [])
	const handleSubmit = async (e) => {
		e.preventDefault()
		await signInWithEmailAndPassword(auth, email, password)
		navigate("/register")

	}
	return (
		<div className="loginwrap">
			<div className="www">
				<img src={Logo} />
				<h4>Login to WLude Berhan</h4>
				<form onSubmit={handleSubmit}>
					<label>Email</label>
					<input placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
					<label>Password</label>
					<input placeholder="Password" type="password"
						onChange={(e) => { setPassword(e.target.value) }} />
					<button className="pushable"><span className="shadow"></span>
						<span className="edge"></span>
						<span className="front">
							Login
						</span></button>
				</form>
			</div>
		</div>
	)

}

export default Login
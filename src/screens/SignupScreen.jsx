import React, { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils/utilsError';

const SignupScreen = () => {
	const navigate = useNavigate();
	const { search } = useLocation();
	const redirectInUrl = new URLSearchParams(search).get('redirect');
	const redirect = redirectInUrl ? redirectInUrl : '/';

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const { state, dispatch: ctxDispatch } = useContext(Store);

	const { userInfo } = state;

	const submitHandler = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}
		try {
			const { data } = await Axios.post('/api/users/signup', {
				name,
				email,
				password,
			});
			ctxDispatch({ type: 'USER_SIGNIN', payload: data });
			localStorage.setItem('userInfo', JSON.stringify(data));
			navigate(redirect || '/');
		} catch (err) {
			toast.error(getError(err));
		}
	};

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [navigate, redirect, userInfo]);

	return (
		<>
			<div className=" flex flex-col w-full max-w-[600px] h-screen mx-auto items-center justify-center  ">
				<Helmet>
					<title>Sign Up</title>
				</Helmet>
				<div className=" flex flex-col w-full">
					<h1 className="mb-3 font-bold">Sign Up</h1>
					<form onSubmit={submitHandler}>
						<label>Name</label>
						<input
							className="mb-3 pl-3 h-10 border border-gray-200 w-full rounded"
							type="text"
							id="name"
							required
							onChange={(e) => setName(e.target.value)}
						/>
						<label>Email</label>
						<input
							className="mb-3 pl-3 h-10 border border-gray-200 w-full rounded"
							type="email"
							id="email"
							required
							onChange={(e) => setEmail(e.target.value)}
						/>
						<label>Password</label>
						<input
							className="mb-3 pl-3 h-10 border border-gray-200 w-full rounded"
							type="password"
							id="password"
							required
							onChange={(e) => setPassword(e.target.value)}
						/>
						<label> Confirm Password</label>
						<input
							className="mb-3 pl-3 h-10 border border-gray-200 w-full rounded"
							type="password"
							id="confirmPassword"
							required
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<button
							type="submit"
							className="bg-[#f0c14b] rounded-md my-3  mx-auto py-1 px-2 border border-[#a88734]"
						>
							Sign Up
						</button>
					</form>
					<div className="flex w-full ">
						<h4 className="mr-2">Already have an account?</h4>

						<Link
							to={`signin?redirect=${redirect}`}
							className="text-blue-600 cursor-pointer"
						>
							Sign-In
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default SignupScreen;

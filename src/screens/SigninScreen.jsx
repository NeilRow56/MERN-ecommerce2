import React, { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils/utilsError';

const SigninScreen = () => {
	const navigate = useNavigate();
	const { search } = useLocation();
	const redirectInUrl = new URLSearchParams(search).get('redirect');
	const redirect = redirectInUrl ? redirectInUrl : '/';

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { state, dispatch: ctxDispatch } = useContext(Store);

	const { userInfo } = state;

	const submitHandler = async (e) => {
		e.preventDefault();

		try {
			const { data } = await Axios.post('/api/users/signin', {
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
					<title>Sign In</title>
				</Helmet>
				<div className=" flex flex-col w-full">
					<h1 className="mb-3 font-bold">Sign In</h1>
					<form onSubmit={submitHandler}>
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
						<button
							type="submit"
							className="bg-[#f0c14b] rounded-md my-3  mx-auto py-1 px-2 border border-[#a88734]"
						>
							Sign In
						</button>
					</form>
					<div className="flex w-full ">
						<h4 className="mr-2">New customer?</h4>

						<Link
							to={`/signup?redirect=${redirect}`}
							className="text-blue-600 cursor-pointer"
						>
							Create your account
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default SigninScreen;

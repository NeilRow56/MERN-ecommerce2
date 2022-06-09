import React, { useContext, useState, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { toast } from 'react-toastify';
import { getError } from '../utils/utilsError';
import axios from 'axios';
import { Store } from '../Store';

const reducer = (state, action) => {
	switch (action.type) {
		case 'UPDATE_REQUEST':
			return { ...state, loadingUpdate: true };
		case 'UPDATE_SUCCESS':
			return { ...state, loadingUpdate: false };
		case 'UPDATE_FAIL':
			return { ...state, loadingUpdate: false };

		default:
			return state;
	}
};

export default function ProfileScreen() {
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;
	const [name, setName] = useState(userInfo.name);
	const [email, setEmail] = useState(userInfo.email);
	const [password, setPassword] = useState('');
	const [setConfirmPassword] = useState('');

	const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
		loadingUpdate: false,
	});

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.put(
				'/api/users/profile',
				{
					name,
					email,
					password,
				},
				{
					headers: { Authorization: `Bearer ${userInfo.token}` },
				}
			);
			dispatch({
				type: 'UPDATE_SUCCESS',
			});
			ctxDispatch({ type: 'USER_SIGNIN', payload: data });
			localStorage.setItem('userInfo', JSON.stringify(data));
			toast.success('User updated successfully');
		} catch (err) {
			dispatch({
				type: 'FETCH_FAIL',
			});
			toast.error(getError(err));
		}
	};

	return (
		<>
			<Header />
			<div className=" flex flex-col w-full max-w-[600px] h-screen mx-auto items-center justify-center  ">
				<Helmet>
					<title>User Profile</title>
				</Helmet>

				<div className=" flex flex-col w-full">
					<h1 className="mb-3 font-bold">User Profile</h1>
					<form onSubmit={submitHandler}>
						<div className="mb-3" controlId="name">
							<label>Name</label>
							<input
								className="mb-3 pl-3 h-10 border border-gray-200 w-full rounded"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						<div className="mb-3" controlId="name">
							<label>Email</label>
							<input
								className="mb-3 pl-3 h-10 border border-gray-200 w-full rounded"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="mb-3" controlId="password">
							<label>Password</label>
							<input
								className="mb-3 pl-3 h-10 border border-gray-200 w-full rounded"
								type="password"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className="mb-3" controlId="password">
							<label>Confirm Password</label>
							<input
								className="mb-3 pl-3 h-10 border border-gray-200 w-full rounded"
								type="password"
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
							/>
						</div>
						<div className="mb-3">
							<button
								className="bg-[#f0c14b] rounded-md my-3  mx-auto py-1 px-2 border border-[#a88734]"
								type="submit"
							>
								Update
							</button>
						</div>
					</form>
				</div>
			</div>
			<Footer />
		</>
	);
}

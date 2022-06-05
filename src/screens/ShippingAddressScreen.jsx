import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutProgress from '../components/CheckoutProgress';
import Header from '../components/Header';

export default function ShippingAddressScreen() {
	const navigate = useNavigate();
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const {
		userInfo,
		cart: { shippingAddress },
	} = state;
	const [fullName, setFullName] = useState(shippingAddress.fullName || '');
	const [address, setAddress] = useState(shippingAddress.address || '');
	const [city, setCity] = useState(shippingAddress.city || '');
	const [postCode, setPostCode] = useState(shippingAddress.postCode || '');
	const [country, setCountry] = useState(shippingAddress.country || '');

	useEffect(() => {
		if (!userInfo) {
			navigate('/signin?redirect=/shipping');
		}
	}, [userInfo, navigate]);
	const submitHandler = (e) => {
		e.preventDefault();
		ctxDispatch({
			type: 'SAVE_SHIPPING_ADDRESS',
			payload: {
				fullName,
				address,
				city,
				postCode,
				country,
			},
		});
		localStorage.setItem(
			'shippingAddress',
			JSON.stringify({
				fullName,
				address,
				city,
				postCode,
				country,
			})
		);
		navigate('/payment');
	};
	return (
		<>
			<Header />
			<div className="flex flex-col pt-10  w-full h-screen mx-auto ">
				<CheckoutProgress step1 step2 />
				<div className=" flex flex-col w-full max-w-[600px] min-w-[300px] mx-auto my-3 ">
					<Helmet>
						<title>Shipping Adress</title>
					</Helmet>
					<div className=" flex flex-col w-full">
						<h1 className="font-bold">Shipping Address</h1>
					</div>
					<form onSubmit={submitHandler}>
						<label>Full Name</label>
						<input
							className="mb-3 pl-3  h-10 border border-gray-200 w-full  rounded"
							value={fullName}
							required
							onChange={(e) => setFullName(e.target.value)}
						/>
						<label>Address</label>
						<input
							className="mb-3 pl-3 h-10 border border-gray-200 w-full rounded"
							value={address}
							required
							onChange={(e) => setAddress(e.target.value)}
						/>
						<label>City</label>
						<input
							className="mb-3 pl-3 h-10 border border-gray-200 w-full rounded"
							value={city}
							required
							onChange={(e) => setCity(e.target.value)}
						/>
						<label>Post Code</label>
						<input
							className="mb-3 pl-3 h-10 border border-gray-200 w-full rounded"
							value={postCode}
							required
							onChange={(e) => setPostCode(e.target.value)}
						/>
						<label>Country</label>
						<input
							className="mb-3 pl-3 h-10 border border-gray-200 w-full rounded"
							value={country}
							required
							onChange={(e) => setCountry(e.target.value)}
						/>
						<button
							type="submit"
							className="bg-[#f0c14b] rounded-md my-3  mx-auto py-1 px-2 border border-[#a88734]"
						>
							Continue
						</button>
					</form>
				</div>
			</div>
		</>
	);
}

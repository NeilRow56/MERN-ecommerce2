import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckoutProgress from '../components/CheckoutProgress';
import { Store } from '../Store';
import Header from '../components/Header';

export default function PaymentMethodScreen() {
	const navigate = useNavigate();
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const {
		cart: { shippingAddress, paymentMethod },
	} = state;

	const [paymentMethodName, setPaymentMethod] = useState(
		paymentMethod || 'PayPal'
	);

	useEffect(() => {
		if (!shippingAddress.address) {
			navigate('/shipping');
		}
	}, [shippingAddress, navigate]);
	const submitHandler = (e) => {
		e.preventDefault();
		ctxDispatch({
			type: 'SAVE_PAYMENT_METHOD',
			payload: paymentMethodName,
		});
		localStorage.setItem('paymentMethod', paymentMethodName);
		navigate('/placeorder');
	};
	return (
		<>
			<Header />
			<div className="flex flex-col pt-10   w-full h-screen mx-auto ">
				<CheckoutProgress step1 step2 step3 />
				<div className=" flex flex-col w-full max-w-[600px] min-w-[300px] mx-auto my-3 ">
					<Helmet>
						<title>Payment</title>
					</Helmet>
					<div className=" flex flex-col w-full">
						<h1 className="font-bold">Payment Method</h1>
					</div>

					<div className="flex space-y-5 my-5">
						<form onSubmit={submitHandler}>
							<div className="form-check mb-5">
								<input
									className="form-check-input appearance-none rounded-full h-4 w-4  border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left  mr-2 cursor-pointer "
									type="radio"
									id="PayPal"
									value="PayPal"
									checked={paymentMethodName === 'PayPal'}
									onChange={(e) =>
										setPaymentMethod(e.target.value)
									}
								/>
								<label
									className="form-check-label inline-block text-gray-800 "
									htmlFor="PayPal"
								>
									PayPal
								</label>
							</div>
							<div className="form-check mb-5">
								<input
									className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
									type="radio"
									id="Stripe"
									value="Stripe"
									checked={paymentMethodName === 'Stripe'}
									onChange={(e) =>
										setPaymentMethod(e.target.value)
									}
								/>
								<label
									className="form-check-label inline-block text-gray-800"
									htmlFor="Stripe"
								>
									Stripe
								</label>
								<button
									type="submit"
									className="bg-[#f0c14b] rounded-md mt-5 w-full mx-auto p-1 border border-[#a88734]"
								>
									Continue
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

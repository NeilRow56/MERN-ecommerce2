import React from 'react';
import Axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { toast } from 'react-toastify';
import { getError } from '../utils/utilsError';
import { Store } from '../Store';
import CheckoutProgress from '../components/CheckoutProgress';

const reducer = (state, action) => {
	switch (action.type) {
		case 'CREATE_REQUEST':
			return { ...state, loading: true };
		case 'CREATE_SUCCESS':
			return { ...state, loading: false };
		case 'CREATE_FAIL':
			return { ...state, loading: false };
		default:
			return state;
	}
};

export default function PlaceOrderScreen() {
	const navigate = useNavigate();

	const [{ loading }, dispatch] = useReducer(reducer, {
		loading: false,
	});

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { cart, userInfo } = state;

	const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
	cart.itemsPrice = round2(
		cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
	);
	cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
	cart.taxPrice = round2(0.2 * cart.itemsPrice);
	cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

	const placeOrderHandler = async () => {
		try {
			dispatch({ type: 'CREATE_REQUEST' });

			const { data } = await Axios.post(
				'/api/orders',
				{
					orderItems: cart.cartItems,
					shippingAddress: cart.shippingAddress,
					paymentMethod: cart.paymentMethod,
					itemsPrice: cart.itemsPrice,
					shippingPrice: cart.shippingPrice,
					taxPrice: cart.taxPrice,
					totalPrice: cart.totalPrice,
				},
				{
					headers: {
						authorization: `Bearer ${userInfo.token}`,
					},
				}
			);
			ctxDispatch({ type: 'CART_CLEAR' });
			dispatch({ type: 'CREATE_SUCCESS' });
			localStorage.removeItem('cartItems');
			navigate(`/order/${data.order._id}`);
		} catch (err) {
			dispatch({ type: 'CREATE_FAIL' });
			toast.error(getError(err));
		}
	};

	useEffect(() => {
		if (!cart.paymentMethod) {
			navigate('/payment');
		}
	}, [cart, navigate]);

	return (
		<>
			<Header />
			<div className="pt-5 max-w-[1200px] h-screen mx-auto flex flex-col  ">
				<CheckoutProgress step1 step2 step3 step4 />
				<Helmet>
					<title>Preview Order</title>
				</Helmet>
				<h1 className="font-bold my-2 mx-5">Preview Order</h1>
				<div className="grid grid-cols-3 gap-4 mx-5 ">
					<div className="col-span-3 md:col-span-2">
						<div className="border border-gray-200 rounded w-full p-3">
							<h2 className="font-semibold">Shipping</h2>
							<div className="my-2">
								<strong>Name:</strong>{' '}
								{cart.shippingAddress.fullName}
							</div>
							<div>
								<strong>Address: </strong>{' '}
								{cart.shippingAddress.address},{' '}
								{cart.shippingAddress.city},{' '}
								{cart.shippingAddress.postCode},{' '}
								{cart.shippingAddress.country}
							</div>
							<Link to="/shipping">
								<li className="list-none text-blue-500 my-2">
									Edit
								</li>
							</Link>
						</div>
						<div className="border border-gray-200 rounded w-full p-3 mt-4">
							<h2 className="font-semibold my-2">Payment</h2>
							<div>
								<strong>Method:</strong> {cart.paymentMethod}
							</div>

							<Link to="/payment">
								<li className="list-none text-blue-500 my-2">
									Edit
								</li>
							</Link>
						</div>
						<h2 className="font-semibold ml-3 mt-2">Items:</h2>
						{cart.cartItems.map((item) => (
							<div
								key={item._id}
								className="border border-gray-200 rounded w-full p-3 mt-4"
							>
								<div className="flex items-center pl-20">
									<div className="w-full  ">
										<img
											className=" justify-center w-20 h-25"
											src={item.image}
											alt={item.name}
										/>
									</div>
									<div className="w-full">
										<Link to={`/product/${item.slug}`}>
											{item.name}
										</Link>
									</div>
									<div className="w-full">
										{item.quantity}
									</div>
									<div className="w-full">£{item.price}</div>
								</div>

								<Link to="/cart">
									<li className="list-none text-blue-500 my-2">
										Edit
									</li>
								</Link>
							</div>
						))}
					</div>
					<div className="">
						<div className="w-full border border-gray-200 rounded">
							<h2 className="font-semibold ml-3">
								Order Summary
							</h2>
							<div className="flex border-b border-gray-200 mx-5 mt-1">
								<div className="w-full ">Items</div>
								<div className="w-full">
									£{cart.itemsPrice.toFixed(2)}
								</div>
							</div>
							<div className="flex border-b border-gray-200 mx-5 mt-2">
								<div className="w-full  ">Shipping</div>
								<div className="w-full">
									£{cart.shippingPrice.toFixed(2)}
								</div>
							</div>
							<div className="flex border-b border-gray-200 mx-5 mt-2">
								<div className="w-full ">VAT</div>
								<div className="w-full">
									£{cart.taxPrice.toFixed(2)}
								</div>
							</div>
							<div className="flex border-b border-gray-200 mx-5 mt-2">
								<div className="w-full  font-bold">
									Order Total
								</div>
								<div className="w-full">
									<h4 className="font-bold">
										£{cart.totalPrice.toFixed(2)}
									</h4>
								</div>
							</div>
							<div className="flex w-full  ">
								<button
									onClick={placeOrderHandler}
									type="button"
									disabled={cart.cartItems.length === 0}
									className="bg-[#f0c14b] rounded-md my-3 mx-auto  w-3/4 py-1 px-2 border border-[#a88734]"
								>
									Place Order
								</button>
							</div>
							{loading && (
								<div>
									{' '}
									<h4>Loading...</h4>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

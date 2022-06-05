import React, { useContext } from 'react';
import { Store } from '../Store';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const CartScreen = () => {
	const navigate = useNavigate();
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const {
		cart: { cartItems },
	} = state;

	const updateCartHandler = async (item, quantity) => {
		const { data } = await axios.get(`/api/products/${item._id}`);
		if (data.countInStock < quantity) {
			window.alert('Sorry. Product is out of stock');
			return;
		}

		ctxDispatch({
			type: 'CART_ADD_ITEM',
			payload: { ...item, quantity },
		});
	};

	const removeItemHandler = (item) => {
		ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
	};

	const checkoutHandler = () => {
		navigate('/signin?redirect=/shipping');
	};

	return (
		<>
			<Header />

			<div className="flex w-full  mx-auto max-w-[1300px]">
				<div>
					<Helmet>
						<title>Shopping Cart</title>
					</Helmet>
				</div>
				<h1 className="font-bold ml-2 pt-16 pb-2 md:py-16">
					Shopping Cart
				</h1>
			</div>
			{cartItems.length === 0 ? (
				<div className="w-full max-w-[1300px] mx-auto">
					<h2 className="font-semibold">Cart is empty</h2>
					<Link to="/">
						<div className="my-3 flex items-center">
							<HiOutlineArrowNarrowLeft />
							<h6 className="ml-3">Continue Shopping</h6>
						</div>
					</Link>
				</div>
			) : (
				<div className="flex flex-col lg:flex lg:flex-row  w-full max-w-[1300px]  mx-auto">
					<div className="flex flex-col w-[350px] sm:w-[400px] md:w-[600px] lg:w-[700px] xl:w-[900px] mx-auto mb-4 ">
						<Link to="/">
							<div className="my-3 flex items-center">
								<HiOutlineArrowNarrowLeft />
								<h6 className="ml-3">Continue Shopping</h6>
							</div>
						</Link>
						{cartItems.map((item) => (
							<div
								key={item._id}
								className=" flex w-full m-1 rounded border border-gray-200"
							>
								<div className=" w-[60px] h-[72px] md:w-[80px] md:h-[100px] relative border border-gray-100 rounded m-1">
									<img
										alt={item.name}
										src={item.image}
										layout="fill"
										className="cursor-pointer rounded-md"
									/>
								</div>
								<div className=" w-1/3 flex flex-col justify-center items-start list-none  ">
									<Link to={`/product/${item.slug}`}>
										<li className="ml-2">{item.name}</li>
									</Link>
								</div>
								<div className="w-1/3 font-bold flex flex-col justify-center items-center ">
									<div className="border border-gray-200 text-center  rounded-md  h-10 w-[60px] md:w-[120px]  ">
										<div className=" flex  ">
											<button
												className="mx-auto  w-3 md:w-6  text-2xl "
												disabled={item.quantity === 1}
												onClick={() =>
													updateCartHandler(
														item,
														item.quantity - 1
													)
												}
											>
												-
											</button>
											<div className=" text-lg pt-1">
												{item.quantity}
											</div>

											<button
												className="mx-auto w-3 md:w-6  text-2xl"
												disabled={
													item.quantity ===
													item.countInStock
												}
												onClick={() =>
													updateCartHandler(
														item,
														item.quantity + 1
													)
												}
											>
												+
											</button>
										</div>
									</div>
								</div>
								<div className="w-1/3 flex flex-col justify-center items-center ">
									<h4>£{item.price}</h4>
								</div>
								<div className="flex flex-col items-center justify-center ">
									<RiDeleteBin6Fill
										onClick={() => removeItemHandler(item)}
										className="text-red-600 w-8 h-8 cursor-pointer"
									/>
								</div>
							</div>
						))}
					</div>
					<div className=" w-[300px] lg:w-1/4 flex flex-col  mt-10  md:mt-0  mx-auto">
						<div className="border border-gray-200 pb-5 rounded p-4">
							<h2 className="font-bold  ">
								Subtotal (
								{cartItems.reduce(
									(amount, item) => amount + item.quantity,
									0
								)}{' '}
								items) :
							</h2>
							<h2 className="font-bold border-b border-gray-200 ">
								£{' '}
								{cartItems.reduce(
									(amount, item) =>
										amount + item.price * item.quantity,
									0
								)}
							</h2>
							<button
								onClick={checkoutHandler}
								disabled={cartItems.length === 0}
								className="bg-[#f0c14b] rounded-md mt-4 w-full  p-1  border border-[#a88734]  mx-auto "
							>
								Proceed to Checkout
							</button>
						</div>
					</div>
				</div>
			)}

			<Footer />
		</>
	);
};

export default CartScreen;

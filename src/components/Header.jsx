import React, { useState, useContext } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { HiOutlineMenuAlt4 } from 'react-icons/hi';
import {
	FaFacebook,
	FaTwitter,
	FaInstagram,
	FaPinterest,
	FaYoutube,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import Dropdown from './Dropdown';

function Navbar() {
	const { state } = useContext(Store);
	const { cart, userInfo } = state;

	const [nav, setNav] = useState(false);
	const [logo, setLogo] = useState(false);
	const handleNav = () => {
		setNav(!nav);
		setLogo(!logo);
	};

	return (
		<div className="flex w-full justify-between  items-center h-12 px-4 md:px-[250px]  absolute z-10 text-white bg-[#404040]">
			<Link to="/">
				<li className="list-none font-bold">Amazona</li>
			</Link>
			<div className="flex items-center space-x-3">
				<ul
					className="hidden  md:flex space-x-3
            "
				>
					<Link to="/">
						<li>Home</li>
					</Link>
					<Link to="/about">
						<li>About</li>
					</Link>

					<li>Travel</li>
				</ul>
				<Link to="/cart">
					<div className="flex items-center">
						<h4>Cart</h4>

						{cart.cartItems.length > 0 && (
							<div className="bg-red-600 rounded-full  w-8 h-8  ml-3 px-2 text-[#ffff]     ">
								<div className="text-center pt-1">
									{cart.cartItems.reduce(
										(a, c) => a + c.quantity,
										0
									)}
								</div>
							</div>
						)}
					</div>
				</Link>
				{userInfo ? (
					<Dropdown />
				) : (
					<Link className="nav-link" to="/signin">
						Sign In
					</Link>
				)}
			</div>
			{/* Hamburger  */}
			<div onClick={handleNav} className="md:hidden z-10 ">
				{nav ? (
					<AiOutlineClose className="text-black" sizs={20} />
				) : (
					<HiOutlineMenuAlt4 size={20} />
				)}
			</div>
			{/* Mobile menu dropdown */}
			<div
				onClick={handleNav}
				className={
					nav
						? 'absolute text-black left-0 top-0 w-full bg-gray-100/90 px-4 py-7 flex flex-col'
						: 'absolute left-[-100%]'
				}
			>
				<ul>
					<h1>BEACHES.</h1>
					<li className="border-b">Home</li>
					<li className="border-b">Destinations</li>
					<li className="border-b">Travel</li>
					<li className="border-b">View</li>
					<li className="border-b">Book</li>
					<div className="flex flex-col">
						<button className="my-6">Search</button>
						<button>Account</button>
					</div>
					<div className=" flex flex-row justify-between my-6">
						<FaFacebook className="icon" />
						<FaTwitter className="icon" />
						<FaYoutube className="icon" />
						<FaPinterest className="icon" />
						<FaInstagram className="icon" />
					</div>
				</ul>
			</div>
		</div>
	);
}

export default Navbar;

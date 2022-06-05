import React, { useState, useContext } from 'react';

import { FaCaretDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

const Dropdown = () => {
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;

	const signoutHandler = () => {
		ctxDispatch({ type: 'USER_SIGNOUT' });
		localStorage.removeItem('userInfo');
		localStorage.removeItem('shippingAddress');
		localStorage.removeItem('paymentMethod');
	};

	const [isActive, setIsActive] = useState(false);
	const handleClick = () => setIsActive(!isActive);
	return (
		<div className="relative flex flex-col h-[50px] w-[80px] justify-left mt-4">
			<button
				id="menu-btn"
				className="bg-blue-500  rounded-lg text-white px-2 py-1"
			>
				<div className="flex items-center" onClick={handleClick}>
					{userInfo.name}

					<FaCaretDown className="ml-2" />
				</div>
			</button>
			{isActive && (
				<div
					id="dropdown"
					className="absolute right-0 top-10  flex flex-col text-red-700 bg-gray-200 rounded mt-6 py-2 pl-5  pb-2 w-36 "
				>
					<Link to="/profile">
						<li
							className="cursor-pointer list-none border-b border-gray-300 
								hover:bg-gray-400 rounded
							hover:text-white
							"
						>
							User Profile
						</li>
					</Link>
					<Link to="/orderhistory">
						<li
							className="cursor-pointer list-none border-b border-gray-300 
								hover:bg-gray-400 rounded
							hover:text-white
							"
						>
							Order History
						</li>
					</Link>
					<Link onClick={signoutHandler} to="#signout">
						<li
							className="cursor-pointer list-none hover:bg-gray-400 rounded
							hover:text-white"
						>
							Sign Out
						</li>
					</Link>
				</div>
			)}
		</div>
	);
};

export default Dropdown;

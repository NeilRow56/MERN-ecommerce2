import React from 'react';

export default function CheckoutProgress(props) {
	return (
		<div className="  flex  w-full px-1  my-10 ">
			<div className="checkout-steps flex w-full max-w-[1200px] mx-auto">
				<div
					className={` w-1/4 rounded-l ${
						props.step1 ? 'active' : ''
					}`}
				>
					Sign-in
				</div>
				<div className={` w-1/4 ${props.step2 ? 'active' : ''}`}>
					Shipping
				</div>
				<div className={` w-1/4 ${props.step3 ? 'active' : ''}`}>
					Payment
				</div>
				<div
					className={` w-1/4 rounded-r ${
						props.step4 ? 'active' : ''
					}`}
				>
					Place Order
				</div>
			</div>
		</div>
	);
}

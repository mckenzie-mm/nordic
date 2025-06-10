"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

import InputNumber from "@/app/ui-client/input-number";
import { HREF } from "@/app/aws-images/s3-configuration";
import { store } from "@/app/services/cart-service";
import { ICartItem } from "@/app/DTO/cart";

const { 
    CART_PAGE_TITLE, CART_PAGE_SUMMARY_TITLE, CONTINUE_SHOPPING_BTN,
    CONTINUE_TO_CHECKOUT_BTN, SUBTOTAL, ADD_VOUCHER, SHIPMENT,
    SHIPMENT_PRICE_LOCAL, SHIPMENT_PRICE_NATIONAL
} = require("@/app/templates");

export default function Cart() {
    const [cart, setCart] = useState<Array<ICartItem>>([]);

    useEffect(() => {
        setCart(store.getCart());
        store.registerCallback(callback);
    }, []);

    const callback = () => setCart(store.getCart());

    let total = 0;
    cart.forEach(({ price, qty }) => {
        total = price * qty + total;
    });

    return (
       <div className="cart">
        <section className="section">
        
            <div className="card-grid">
                <div className="card-grid-item-left">
                    <h2 className="card-grid-item-title">{CART_PAGE_TITLE}</h2>
                    <ul className="cart-items" role="list">
                    {
                        cart.map(({id, name, category, price, image, slug, qty}) => 
                        {
                            const src = HREF + category + "/" + encodeURIComponent(image); 
                            return  <li key={id} className="cart-item">
                                        <div className="cart-row">
                                            <div className="cart-col-1">
                                                <div className="cart-col-img-wrap" >
                                                    <img src={src} className="cart-col-img" width="75" alt="cart item iamge" />
                                                </div>
                                            </div>
                                            <div className="cart-col-2">
                                                <Link href={slug} className="cart-col-heading">{name}</Link>
                                                <div className="cart-price-small">$ {price.toFixed(2)}</div>
                                                <div className="col-cart-qty">
                                                    <span>Anz.</span>
                                                    <InputNumber 
                                                        increment={() => store.increase(id)}              
                                                        decrement={() => store.reduce(id)}              
                                                        value={qty}
                                                    />
                                                </div>
                                            </div>
                                            <div className="cart-col-3">
                                                <h4>&nbsp;</h4>
                                                <div className="cart-price-small">&nbsp;</div>
                                                <p>$ {(price * qty).toFixed(2)}</p>
                                                <button className="remove-btn" onClick={() => store.remove(id)}>
                                                    <i className="cm-font nm-font-close2"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                            
                        })
                    }
                    </ul>
                </div>
                <div className="card-grid-item-right">
                    <h2 className="card-grid-item-title">{CART_PAGE_SUMMARY_TITLE}</h2>
                    <div className="cart-coupon">
                        <div className="nm-coupon-inner">
                            <span id="nm-coupon-btn">{ADD_VOUCHER}</span>
                        </div> 
                    </div>
                    <div className="cart-subtotal"><span>{SUBTOTAL}</span><span className="cart-subtotal-price">$ {total.toFixed(2)}</span></div>
                    <div className="cart-shipping-wrap">
                        <p className="cart-shipping">{SHIPMENT}</p>
                        <p className="cart-shipping-nsw"><span>{SHIPMENT_PRICE_LOCAL}</span>
                            <span className="cart-shipping-nsw-price">$ 0</span></p>
                        <p className="cart-shipping-australia">{SHIPMENT_PRICE_NATIONAL}</p>
                    </div>
                    <div className="cart-total"><span>Total</span><span>$ {total.toFixed(2)}</span></div>
                    <Link href="/" className="cart-btn">{CONTINUE_SHOPPING_BTN}</Link>
                    <button className="cart-paypal-btn">{CONTINUE_TO_CHECKOUT_BTN}</button>
                </div>
            </div>
           
        </section>

       </div>
    );
}



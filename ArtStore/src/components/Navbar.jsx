import { useAtomValue, useAtom } from "jotai";
import { shopCustomerAtom } from "../atoms/shopCustomerAtom.js";
import { shoppingCartAtom } from "../atoms/cartAtom.js";
import { NavLink, Outlet, useLocation } from "react-router";
import { MdScreenLockLandscape } from "react-icons/md";

export const Navbar = () => {
    const [shopCustomer, setShopCustomer] = useAtom(shopCustomerAtom);
    const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);
    const location = useLocation();

    const isAdminPage = location.pathname.includes('/admin');


    return (
        <>
        <nav className="navbar">
            <ul className="navbar-menu">
                {isAdminPage ? (<>
                <li>
                    <NavLink to="/admin" className="navbar-item">Inventory</NavLink>
                </li>
                <li>
                    <NavLink to="/admin/orders" className="navbar-item">Orders</NavLink>
                </li>
                </>) : (
                    <>
                <li>
                    <NavLink to="/" className="navbar-item">Shop</NavLink>
                </li>
                <li>
                    <NavLink to="/cart" className="navbar-item">Cart </NavLink>{shoppingCart && (shoppingCart?.totalPrice? shoppingCart.totalPrice + ' kr': '')}</li>
                {shopCustomer && (<li> User: {shopCustomer.firstname} </li>)}
                {/* <li>
                    <NavLink to="/login" className="navbar-item">Login</NavLink>
                </li> */}
                </>
                )}
            </ul>
        </nav>
        <Outlet />
        <footer className="navbar-footer">
            <p>&copy; 2025 Art Store. All rights reserved.</p>
             {isAdminPage ? (
                <p><NavLink to="/" className="navbar-item">Log out to shop</NavLink></p>
                ) : (
                    <p><NavLink to="/admin" className="navbar-item"><MdScreenLockLandscape size="14" /> Admin</NavLink></p>
                )}
        </footer>
        </>
    );
}

export default Navbar; 
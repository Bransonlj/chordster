import { Outlet } from "react-router-dom";
import MainNavBar from "./MainNavBar";
import Footer from "./Footer";
import styles from './Layout.module.scss';

export default function Layout() {
    return (
        <>
            <MainNavBar/>
            <div className={styles.content}>
                <Outlet/>
            </div>
            <Footer />
        </>
    )
}
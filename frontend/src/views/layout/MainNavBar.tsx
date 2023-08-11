import { useAuth } from "../../context/AuthContext";
import { NavLink, Outlet } from 'react-router-dom'

export default function MainNavBar() {
    const { user, logout } = useAuth();

    function handleLogout() {
        localStorage.removeItem('user');
        logout();
    }

    return (
        <div>
            { user &&
                <div>
                    Welcome {user.email}
                    <button type="button" onClick={handleLogout}>Log Out</button>
                </div>
            }
            { !user &&
                <nav>
                    <NavLink to="/login">login</NavLink>
                    <NavLink to="/signup">signup</NavLink>
                </nav>
            }
            <Outlet/>
        </div>
    )
}
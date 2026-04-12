import { Outlet } from "react-router";

export default function Layout() {
    return (
        <div>
            <main>
                {/* This is where your Home or Dashboard will render */}
                <Outlet />
            </main>
        </div>
    );
}

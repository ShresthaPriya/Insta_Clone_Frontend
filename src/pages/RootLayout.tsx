import { Outlet } from "react-router-dom";
const RootLayout = () =>{
    return (
        <main className = "text-center font-roboto">
            <Outlet/>
        </main>
    );
};

export default RootLayout;
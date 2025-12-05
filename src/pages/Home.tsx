import Sidebar from "../components/Sidebar"

const Home = () => {

  const handleSidebarClick = (page: string) => {
    console.log("Sidebar clicked →", page);
  };

  return (
    <>
      <h1>Home page</h1>
      <Sidebar onClick={handleSidebarClick} />
    </>
  );
}

export default Home;

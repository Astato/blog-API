import BlogCategories from "./BlogCategories";

const Home = () => {
  return (
    <div id="home">
      <div aria-hidden="true" id="home-decor">
        <h1>Climb The Path !</h1>
        <p>CREATE</p>
        <p>SHARE</p>
        <p>INSPIRE</p>
        <p>DISCOVER</p>
      </div>
      <div className="categories-container">
        <h1>Discover</h1>
        <BlogCategories></BlogCategories>
      </div>
    </div>
  );
};

export default Home;

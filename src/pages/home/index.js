import "./style.css";
import SmartphoneSection from "../../components/SmartphoneSection";
import LaptopSection from "../../components/LaptopSection";
import TabletSection from "../../components/TabletSection";

function Home() {
  return (
    <>
    <div className="home">
      <SmartphoneSection />
      <LaptopSection />
      <TabletSection />
    </div>
    </>
  );
}

export default Home;

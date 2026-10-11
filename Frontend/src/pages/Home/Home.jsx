import Hero from "../../components/Hero/Hero";
import ProjectOverview from "../../components/ProjectOverview/ProjectOverview";
import ProjectHighlights from "../../components/ProjectHighlights/ProjectHighlights";
import MasterPlan from "../../components/MasterPlan/MasterPlan";
import FloorPlans from "../../components/FloorPlans/FloorPlans";
import UnitPlans from "../../components/UnitPlans/UnitPlans";
import Amenities from "../../components/Amenities/Amenities";
import Specifications from "../../components/Specifications/Specifications";
import Location from "../../components/Location/Location";
import Brochure from "../../components/Brochure/Brochure";

const Home = () => (
  <div className="home-page">
    <Hero />
    <ProjectOverview />
    <ProjectHighlights />
    <MasterPlan />
    <FloorPlans />
    <UnitPlans />
    <Amenities />
    <Specifications />
    <Location />
    <Brochure />
  </div>
);

export default Home;

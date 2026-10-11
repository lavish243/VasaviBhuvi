import { Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import FloatingButtons from "./components/FloatingButtons/FloatingButtons";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import FloorPlans from "./pages/FloorPlans/FloorPlans";
import Amenities from "./pages/Amenities/Amenities";
import Gallery from "./pages/Gallery/Gallery";
import Location from "./pages/Location/Location";
import ContactPage from "./pages/Contact/ContactPage";
import NotFound from "./pages/NotFound/NotFound";
import { Privacy, Terms } from "./pages/Legal/Legal";

import AdminLogin from "./admin/AdminLogin";
import AdminRoute from "./admin/AdminRoute";
import AdminDashboard from "./admin/AdminDashboard";
import FloorPlansManagement from "./admin/FloorPlansManagement";
import AmenitiesManagement from "./admin/AmenitiesManagement";
import GalleryManagement from "./admin/GalleryManagement";
import SpecificationsManagement from "./admin/SpecificationsManagement";
import ProjectManagement from "./admin/ProjectManagement";
import EnquiriesManagement from "./admin/EnquiriesManagement";
import PageSections from "./admin/PageSections";

const PublicLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
    <FloatingButtons />
  </>
);

const App = () => {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/floor-plans" element={<FloorPlans />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/location" element={<Location />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin dashboard */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="floor-plans" element={<FloorPlansManagement />} />
          <Route path="amenities" element={<AmenitiesManagement />} />
          <Route path="gallery" element={<GalleryManagement />} />
          <Route path="specifications" element={<SpecificationsManagement />} />
          <Route path="project" element={<ProjectManagement />} />
          <Route path="enquiries" element={<EnquiriesManagement />} />
          <Route path="page-sections" element={<PageSections />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;

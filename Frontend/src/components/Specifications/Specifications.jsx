import { useEffect, useState } from "react";

import {
  Building2,
  Home,
  MapPin,
  Ruler,
  Layers3,
  Trees,
  Landmark,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

import specificationsData from "../../data/specificationsData";
import { getSpecifications } from "../../api/contentService";
import "./Specifications.css";

const iconMap = {
  "Project Type": Building2,
  Location: MapPin,
  "Land Area": Ruler,
  "Total Units": Home,
  "Residential Towers": Building2,
  Floors: Layers3,
  "Open Space": Trees,
  Clubhouses: Landmark,
  "Clubhouse Area": Ruler,
  Configurations: Home,
  "RERA Number": ShieldCheck,
  Possession: CalendarDays,
};

const normalizeSpecification = (item, index) => ({
  id: item.id ?? index + 1,
  label:
    item.label ??
    item.name ??
    item.Name ??
    item.category ??
    item.Category ??
    "Specification",
  value: item.value ?? item.description ?? item.Description ?? "",
});

const Specifications = () => {
  const [items, setItems] = useState(specificationsData);

  useEffect(() => {
    let isMounted = true;

    const loadSpecifications = async () => {
      try {
        const data = await getSpecifications();
        const records = Array.isArray(data) ? data : data?.items;

        if (isMounted && Array.isArray(records) && records.length > 0) {
          setItems(records.map(normalizeSpecification));
        } else if (isMounted && Array.isArray(records)) {
          setItems(specificationsData);
        }
      } catch (error) {
        console.error("Failed to load specifications from API:", error);

        if (isMounted) {
          setItems(specificationsData);
        }
      }
    };

    loadSpecifications();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="specifications section" id="specifications">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">PROJECT DETAILS</span>

          <h2 className="section-title">Specifications</h2>

          <p className="section-description">
            Key details and specifications of the Vasavi Bhuvi residential
            community.
          </p>
        </div>

        <div className="specifications-grid">
          {items.map((item, index) => {
            const Icon = iconMap[item.label] || Building2;

            return (
              <div className="specification-card" key={item.id ?? index}>
                <div className="specification-icon">
                  <Icon size={22} />
                </div>

                <div className="specification-content">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Specifications;

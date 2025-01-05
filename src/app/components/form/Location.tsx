import { Postion } from "@/app/types/props/postion";
import { useState, useEffect } from "react";

const Location: React.FC<{
  setLocation: React.Dispatch<React.SetStateAction<Postion>>;
}> = ({ setLocation }) => {
  const massageSuccessfull = "המיקום הנוכחי שלך עודכן";
  
  const [massage, setMassage] = useState<string>(massageSuccessfull);

  // Function to get user location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setMassage("הדפדפן שלך לא תומך בשירותי מיקום.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setMassage(massageSuccessfull); // Reset error on success
      },
      () => {
        setMassage("לא הצלחנו להשיג את המיקום שלך. נסה שוב.");
        setMassage(massageSuccessfull);
      }
    );
  };

  // Automatically fetch location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className=" items-center justify-center">
      <h3 className="section-title">מיקום</h3>
      <h4 className="text-center">{massage}</h4>
    </div>
  );
};

export default Location;

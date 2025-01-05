import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { getCities } from "@/app/services/api/cityService";
import City from "@/app/types/props/city";
import { SelectProps } from "@/app/types/selectProps";
import cityStore from "@/app/store/cityStore";

const CitySelect: React.FC<{ onSelect: (selectedColorId: string) => void }> = ({
  onSelect,
}) => {
  const [selectedValue, setSelectedValue] = useState("");

  const citiesFromStore = cityStore((state) => state.cities);
  const setCities = cityStore((state) => state.setCities);

  const {
    data: cities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
    enabled: citiesFromStore === null,
  });

  // Update the store with fetched cities if the store doesn't already have them
  useEffect(() => {
    if (cities && citiesFromStore === null) {
      setCities(cities);
    }
  }, [cities, citiesFromStore, setCities]);

  if (isLoading) return <div>טוען...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;
  if ((citiesFromStore ?? cities)?.length === 0)
    return <div>ערים לא זמין</div>;

  // Handle the change event for the Select component
  const handleChange = (selectedOption: SelectProps) => {
    const selectedCity = selectedOption?.value;
    setSelectedValue(selectedCity);
    onSelect(selectedCity);
  };

  // Determine the cities to display (from store or fetched data)
  const displayCities = citiesFromStore ?? cities;

  // Convert the cities to the format required by react-select
  const cityOptions = displayCities.map((city: City) => ({
    value: city.name,
    label: city.name,
  }));

  return (
    <div>
      <Select
        options={cityOptions}
        value={cityOptions.find((city: City) => city.name === selectedValue)}
        onChange={handleChange}
        placeholder="בחר עיר"
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default CitySelect;

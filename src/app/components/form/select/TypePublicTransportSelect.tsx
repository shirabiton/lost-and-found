import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { getTypePublicTransportations } from "@/app/services/api/typePublicTransportationService";
import typePublicTransportStore from "@/app/store/typePublicTransportStore";
import { TypePublicTransport } from "@/app/types/props/typePublicTransport";
import { SelectProps } from "@/app/types/selectProps";

const TypePublicTransportSelect: React.FC<{
  onSelect: (selectedTypesId: string) => void;
}> = ({ onSelect }) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const typePublicTransportsFromStore = typePublicTransportStore(
    (state) => state.typePublicTransports
  );
  const setTypePublicTransports = typePublicTransportStore(
    (state) => state.setTypePublicTransports
  );

  const {
    data: typePublicTransports,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["typePublicTransports"],
    queryFn: getTypePublicTransportations,
    enabled: typePublicTransportsFromStore === null,
  });

  // Update the store with fetched type publicTransport if the store doesn't already have them
  useEffect(() => {
    if (typePublicTransports && typePublicTransportsFromStore == null) {
      setTypePublicTransports(typePublicTransports);
    }
  }, [
    typePublicTransports,
    typePublicTransportsFromStore,
    setTypePublicTransports,
  ]);

  if (isLoading) return <div>טוען...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;
  if ((typePublicTransportsFromStore ?? typePublicTransports)?.length === 0)
    return <div>לא נמצא תחבורה ציבורית</div>;

  // Handle the change event for the Select component
  const handleChange = (selectedOption: SelectProps | null) => {
    const selectedCategoryId = selectedOption?.value || "";
    setSelectedValue(selectedCategoryId);
    onSelect(selectedCategoryId);
  };

  // Determine the type publicTransport to display (from store or fetched data)
  const displayTypePublicTransport =
    typePublicTransportsFromStore ?? typePublicTransports;

  // Convert the type publicTransport to the format required by react-select
  const typePublicTransportOptions: SelectProps[] =
    displayTypePublicTransport.map(
      (typePublicTransport: TypePublicTransport) => ({
        value: String(typePublicTransport._id),
        label: typePublicTransport.title,
      })
    );

  return (
    <div>
      <Select
        options={typePublicTransportOptions}
        value={typePublicTransportOptions.find(
          (option) => option.value === selectedValue
        )}
        onChange={handleChange}
        placeholder="בחר סוג תחבורה ציבורית"
        isSearchable={false}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default TypePublicTransportSelect;

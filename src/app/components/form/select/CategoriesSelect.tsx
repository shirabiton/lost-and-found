import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/app/services/api/categoryService";
import { Category } from "@/app/types/props/category";
import { SelectProps } from "@/app/types/selectProps";
import categoryStore from "@/app/store/categoryStore";

const CategoriesSelect: React.FC<{
  onSelect: (selectedCategoryId: string) => void;
}> = ({ onSelect }) => {
  const [selectedValue, setSelectedValue] = useState("");

  const categoriesFromStore = categoryStore((state) => state.categories);
  const setCategories = categoryStore((state) => state.setCategories);
  const setCurrentCategory = categoryStore((state) => state.setCurrentCategory);

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: categoriesFromStore === null,
  });

  // Update the store with fetched categories if the store doesn't already have them
  useEffect(() => {
    if (categories && categoriesFromStore === null) {
      setCategories(categories);
    }
  }, [categories, categoriesFromStore, setCategories]);

  if (isLoading) return <div>טוען</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;
  if ((categoriesFromStore ?? categories)?.length === 0)
    return <div>לא נמצאו קטגוריות</div>;

  // Handle the change event for the Select component
  const handleChange = (selectedOption: SelectProps) => {
    const selectedCategoryId = selectedOption?.value;
    setSelectedValue(selectedCategoryId);
    onSelect(selectedCategoryId);

    // Find the selected category object and update the current category in the store
    const selectedCategory =
      (categoriesFromStore ?? categories)?.find(
        (category: Category) => String(category._id) === selectedCategoryId
      ) || null;

    setCurrentCategory(selectedCategory);
  };

  // Determine the categories to display (from store or fetched data)
  const displayCategories = categoriesFromStore ?? categories;

  // Convert the categories to the format required by react-select
  const categoryOptions = displayCategories.map((category: Category) => ({
    value: String(category._id),
    label: category.title,
  }));

  return (
    <div>
      <Select
        options={categoryOptions}
        value={categoryOptions.find(
          (category: Category) => String(category._id) === selectedValue
        )}
        onChange={handleChange}
        placeholder="בחר קטגוריה"
        isSearchable={false}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default CategoriesSelect;

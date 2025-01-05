"use client";
import React, { useEffect, useState } from "react";
import { Types } from "mongoose";
import { useRouter } from "next/navigation";
import { z } from "zod";
import PublicTransportation from "../form/PublicTransportation";
import CategoriesSelect from "../form/select/CategoriesSelect";
import SubCategoriesSelect from "../form/select/SubCategoriesSelect";
import ColorSelect from "../form/select/ColorSelect";
import { Circle } from "../../types/props/circle";
import userStore from "../../store/userStore";
import { createLostItem } from "../../services/api/lostItemService";
import lostItemStore from "../../store/lostItemStore";
import Map from "../form/Map";
import { LostItemSchema } from "@/app/schemas/lostItemSchema";
import { PublicTransportRequest } from "@/app/types/request/PublicTransportRequest";
import categoryStore from "@/app/store/categoryStore";
import axios from "axios";
import Token from "@/app/types/NER-model/token";

const LostForm = () => {
  const [, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<
    "map" | "transport" | null
  >(null);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [transportData, setTransportData] = useState<PublicTransportRequest>({
    typePublicTransportId: "",
    line: "",
    city: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const currentCategory = categoryStore((state) => state.currentCategory);
  const currentUser = userStore((state) => state.user);
  const setCurrentLostItem = lostItemStore((state) => state.setCurrentLostItem);

  // useEffect hook to clear errors when fields are updated
  useEffect(() => {
    if (selectedColor) {
      setErrors((prevErrors) => ({ ...prevErrors, colorId: "" }));
    }
    if (selectedSubCategory) {
      setErrors((prevErrors) => ({ ...prevErrors, subCategoryId: "" }));
    }
    if (circles.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, circles: "" }));
    }
    if (
      transportData.city != "" &&
      transportData.line != "" &&
      transportData.typePublicTransportId != ""
    ) {
      setErrors((prevErrors) => ({ ...prevErrors, publicTransport: "" }));
    }
  }, [selectedColor, selectedSubCategory, circles, transportData]);

  const router = useRouter();

  // Validation function for the lost item form using Zod schema
  const validateLostItem = () => {
    try {
      LostItemSchema.parse({
        subCategoryId: selectedSubCategory,
        colorId: selectedColor,
        selectedLocation,
        circles: selectedLocation === "map" ? circles : undefined,
        publicTransport:
          selectedLocation === "transport" ? transportData : undefined,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((e) => {
          if (e.path.length) {
            fieldErrors[e.path[0]] = e.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const analyzeTextWithModel = async (sentence: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_RAILWAY_URL}/analyze`,
        {
          text: sentence,
        },
        { timeout: 40000 }
      );
      const nouns: string = response.data.embeddings[0].tokens
        .filter((token: Token) => token.morph.pos === "NOUN")
        .map((token: Token) => token.lex)
        .join(",");
      if (nouns == undefined) {
        return "שונות";
      }
      return nouns;
    } catch (error) {
      console.error("Error from analyze sending:", error.message);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLostItem()) return;
    const analyzedSubCategory =
      currentCategory?.title === "שונות"
        ? await analyzeTextWithModel(selectedSubCategory)
        : selectedSubCategory;
    const lostItem = {
      _id: new Types.ObjectId(),
      subCategoryId: analyzedSubCategory ? analyzedSubCategory : "",
      colorId: selectedColor,
      userId: String(currentUser?._id),
      circles: selectedLocation === "map" ? circles : null,
      publicTransport:
        selectedLocation === "transport"
          ? {
              typePublicTransportId: transportData.typePublicTransportId,
              line: transportData.line,
              city: transportData.city,
            }
          : null,
    };
    try {
      if (!currentCategory) return;
      const newListItem = await createLostItem(lostItem, currentCategory);
      setCurrentLostItem(newListItem);
      router.replace("/foundItems-list");
    } catch (error) {
      console.error("Error submitting lost item:", error);
    }
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="m-4 h-full overflow-y-auto no-scrollbar">
        <h2 className="text-3xl font-bold text-center mb-4">פריט אבוד</h2>
        <form className="space-y-6 text-right" onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 space-y-6">
              <div>
                <h3 className="section-title">קטגוריה</h3>
                <CategoriesSelect onSelect={setSelectedCategory} />
              </div>
              <div>
                {currentCategory?.title !== "שונות" ? (
                  <>
                    <h3 className="section-title">תת-קטגוריה</h3>
                    <SubCategoriesSelect onSelect={setSelectedSubCategory} />
                    {errors.subCategoryId && (
                      <p className="error-message">{errors.subCategoryId}</p>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="section-title">
                      הכנס תיאור ענייני של הפריט האבוד:{" "}
                    </h3>
                    <input
                      type="text"
                      placeholder="הכנס תיאור "
                      className="block w-full px-3 py-2 border border-primary rounded-md shadow-sm focus:ring-primary sm:text-sm"
                      onChange={(e) => setSelectedSubCategory(e.target.value)}
                    />
                    {errors.subCategoryId && (
                      <p className="error-message">{errors.subCategoryId}</p>
                    )}
                  </>
                )}
              </div>

              <div>
                <h3 className="section-title">צבע</h3>
                <ColorSelect onSelect={setSelectedColor} />
                {errors.colorId && (
                  <p className="error-message">{errors.colorId}</p>
                )}
              </div>
            </div>
            <div className="lg:w-2/3">
              {selectedLocation === null && (
                <div>
                  <h3 className="section-title">מיקום</h3>
                  <div className="flex justify-center gap-16">
                    <button
                      type="button"
                      onClick={() => setSelectedLocation("transport")}
                      className="primary-btn w-full lg:w-auto"
                    >
                      תחבורה ציבורית
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLocation("map")}
                      className="primary-btn w-full lg:w-auto"
                    >
                      מיקום גאוגרפי
                    </button>
                  </div>
                  {errors.selectedLocation && (
                    <p className="error-message">{errors.selectedLocation}</p>
                  )}
                </div>
              )}

              {selectedLocation === "transport" && (
                <>
                  <PublicTransportation
                    transportData={transportData}
                    setTransportData={setTransportData}
                  />
                  {errors.publicTransport && (
                    <p className="error-message">{errors.publicTransport}</p>
                  )}
                </>
              )}
              {selectedLocation === "map" && (
                <>
                  <Map circles={circles} setCircles={setCircles} />
                  {errors.circles && (
                    <p className="error-message">{errors.circles}</p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <button type="submit" className="secondary-btn">
              שלח
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LostForm;

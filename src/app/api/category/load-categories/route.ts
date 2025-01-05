import * as xlsx from 'xlsx';
import SubCategoryModel from "@/app/lib/models/subCategory";
import { Category } from "@/app/types/props/category";
import axios from "axios";
import connect from '@/app/lib/db/mongo';
import CategoryModel from '@/app/lib/models/category';
import { NextRequest, NextResponse } from 'next/server';
import { getVercelUrl } from '@/app/utils/vercelUrl';

export async function POST(request: NextRequest) {

    const vercelUrl = getVercelUrl(request);
    const baseUrl = vercelUrl || process.env.NEXT_PUBLIC_BASE_URL
    try {
        await connect();
        // Reads the content of the Excel file as a binary buffer for further processing
        const fileBuffer = await axios.get(`${baseUrl}/categories.xlsx`, { responseType: 'arraybuffer' });
        // Loads the binary buffer into the XLSX library, which can parse and process Excel files
        const workbook = xlsx.read(fileBuffer.data, { type: 'buffer' });
        // Retrieves the first sheet from the workbook, based on the list of sheet names
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        // Converts the first sheet into a simple JSON format (an array of objects),
        // where each row becomes an object, and column headers are used as keys
        const data: { category: string; subCategory: string; }[] = xlsx.utils.sheet_to_json(sheet);
        console.log("Data from Excel:", data);

        let lastCategoryTitle: string | null = null;

        for (const cell of data) {
            const categoryTitle = cell.category;
            const subCategoryTitle = cell.subCategory;

            // If there is a new category, create it
            if (categoryTitle && categoryTitle !== lastCategoryTitle) {
                // Check before adding, if the category already exists in the database
                let existingCategory = await CategoryModel.findOne({ title: categoryTitle });

                if (!existingCategory) {
                    existingCategory = await axios.post(`${baseUrl}/api/category`, { title: categoryTitle })
                    console.log(`Category "${categoryTitle}" added.`);
                } else {
                    lastCategoryTitle = categoryTitle;
                    console.log(`Category  "${categoryTitle}" already exists.`);
                }

                // Update the last parent category
                lastCategoryTitle = categoryTitle;
            }

            // If there is a subcategory, create the relationship with the parent category
            if (subCategoryTitle) {
                // Check if a subcategory exists in the database
                const existingSubCategory = await SubCategoryModel.findOne({ title: subCategoryTitle });

                if (!existingSubCategory) {
                    const parentCategory: Category | null = await CategoryModel.findOne({ title: lastCategoryTitle });
                    if (parentCategory) {
                        // Create a new subcategory with the parent category id
                        const newSubCategory = await axios.post(`${baseUrl}/api/sub-category`, { title: subCategoryTitle, categoryId: parentCategory._id });
                        if (newSubCategory) {
                            console.log(`Subcategory  "${subCategoryTitle}" added under category "${lastCategoryTitle}".`);
                        }
                    }
                } else {
                    console.log(`Subcategory "${subCategoryTitle}" already exists.`);
                }
            }
        }
        return NextResponse.json({ message: 'Categories were added successfully from file!' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed add categories successfully from file' }, { status: 500 });
    }
}
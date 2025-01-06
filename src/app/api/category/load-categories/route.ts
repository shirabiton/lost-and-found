import * as xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import SubCategoryModel from "@/app/lib/models/subCategory";
import { Category } from "@/app/types/props/category";
import connect from '@/app/lib/db/mongo';
import CategoryModel from '@/app/lib/models/category';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        await connect();
        // Path to the Excel file
        const filePath = path.join(process.cwd(), 'public', 'categories.xlsx');
        // Reads the content of the Excel file as a binary buffer for further processing
        const fileBuffer = fs.readFileSync(filePath);
        // Parse the Excel file
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
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
                    existingCategory = await CategoryModel.create({ title: categoryTitle });
                    // 000 existingCategory = await axios.post(`${baseUrl}/api/category`, )
                } else {
                    lastCategoryTitle = categoryTitle;
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
                        const newSubCategory = await SubCategoryModel.create({ title: subCategoryTitle, categoryId: parentCategory._id });
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
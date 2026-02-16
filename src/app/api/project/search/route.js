import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json({
        success: false,
        message: "Search query is required",
      }, { status: 400 });
    }

    // ILIKE is case-insensitive. % is the wildcard for "any characters"
    const searchTerm = `%${query.trim()}%`;
    
    const sqlQuery = `
      SELECT 
        project_id, title, slug, description, category, price, 
        preview, image, tags, skills, created_at 
      FROM public.projects 
      WHERE 
        title ILIKE $1 OR 
        category ILIKE $1 OR 
        description ILIKE $1
      LIMIT 20;
    `;

    const result = await pool.query(sqlQuery, [searchTerm]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'No project Found',
        payload: []
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully fetched data',
      payload: result.rows,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}
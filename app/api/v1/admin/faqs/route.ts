import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all FAQs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = 'SELECT * FROM faqs';
    const params: any[] = [];

    if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    }

    query += ' ORDER BY order_index ASC';

    const faqs = await db.queryMany(query, params);

    return NextResponse.json({ data: faqs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

// POST - Create a new FAQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, category, order_index, is_published } = body;

    if (!question || !answer || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await db.queryOne(
      `INSERT INTO faqs (question, answer, category, order_index, is_published)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [question, answer, category, order_index || 0, is_published !== false]
    );

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}

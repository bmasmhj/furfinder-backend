import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch a specific FAQ
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const faq = await db.queryOne(
      'SELECT * FROM faqs WHERE id = $1',
      [id]
    );

    if (!faq) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: faq }, { status: 200 });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQ' },
      { status: 500 }
    );
  }
}

// PUT - Update a FAQ
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { question, answer, category, order_index, is_published } = body;

    const faq = await db.queryOne(
      'SELECT * FROM faqs WHERE id = $1',
      [id]
    );

    if (!faq) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    const result = await db.queryOne(
      `UPDATE faqs 
       SET question = $1, answer = $2, category = $3, order_index = $4, 
           is_published = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [
        question || faq.question,
        answer || faq.answer,
        category || faq.category,
        order_index !== undefined ? order_index : faq.order_index,
        is_published !== undefined ? is_published : faq.is_published,
        id
      ]
    );

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a FAQ
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const faq = await db.queryOne(
      'SELECT * FROM faqs WHERE id = $1',
      [id]
    );

    if (!faq) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    await db.execute('DELETE FROM faqs WHERE id = $1', [id]);

    return NextResponse.json(
      { message: 'FAQ deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { date, amount, description, categoryId, typeId, userId } = body;

    if (!date || !amount || !description || !categoryId || !typeId || !userId) {
      return NextResponse.json(
        {
          error:
            "All fields (date, amount, description, categoryId, typeId) are required",
        },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        date,
        amount,
        description,
        userId,
        categoryId,
        typeId,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        date: true,
        amount: true,
        description: true,
        categoryId: true,
        typeId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Article deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { id, date, amount, description, categoryId, typeId } =
      await req.json();

    if (!id || !date || !amount || !description || !categoryId || !typeId) {
      return NextResponse.json(
        {
          error:
            "All fields (id, date, amount, description, categoryId, typeId) are required",
        },
        { status: 400 }
      );
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        date,
        amount,
        description,
        categoryId,
        typeId,
      },
    });

    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

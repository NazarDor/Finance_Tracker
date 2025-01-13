import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name fields are required" },
        { status: 400 }
      );
    }
    const type = await prisma.articleType.create({
      data: {
        name,
      },
    });

    return NextResponse.json(type, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const types = await prisma.articleType.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return NextResponse.json(types);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Type ID is required" },
        { status: 400 }
      );
    }

    await prisma.articleType.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "articleType deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete articleType" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updateData = {
      name,
    };

    const updatedType = await prisma.articleType.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedType, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update articleType" },
      { status: 500 }
    );
  }
}

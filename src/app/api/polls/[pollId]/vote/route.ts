import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { VoteRequest } from '@/lib/types';

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { pollId: string } }
) {
  try {
    const { pollId } = params;
    const body: VoteRequest = await request.json();
    const { selectedOption } = body;

    // First, verify the poll exists and the option is valid
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      select: { options: true },
    });

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    if (!poll.options.includes(selectedOption)) {
      return NextResponse.json(
        { error: 'Invalid option selected' },
        { status: 400 }
      );
    }

    // Create the vote
    await prisma.vote.create({
      data: {
        pollId,
        selectedOption,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    );
  }
}
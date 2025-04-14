import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PollResponse } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { pollId: string } }
) {
  try {
    const { pollId } = params;

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      select: {
        question: true,
        options: true,
      },
    });

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    const response: PollResponse = {
      question: poll.question,
      options: poll.options,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching poll:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poll' },
      { status: 500 }
    );
  }
}
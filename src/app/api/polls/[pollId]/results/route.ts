import { NextResponse } from 'next/server';
import { PollResults } from '@/lib/types';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { pollId: string } }
) {
  try {
    const { pollId } = params;

    // Get the poll and its votes
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        votes: true,
      },
    });

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    // Calculate vote counts for each option
    const voteCounts = poll.options.reduce((acc: Record<string, number>, option: string) => {
      acc[option] = poll.votes.filter((vote: { selectedOption: string }) => vote.selectedOption === option).length;
      return acc;
    }, {});

    const response: PollResults = {
      question: poll.question,
      options: poll.options,
      voteCounts,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching poll results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poll results' },
      { status: 500 }
    );
  }
}
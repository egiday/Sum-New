import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CreatePollRequest, CreatePollResponse } from '@/lib/types';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body: CreatePollRequest = await request.json();
    const { question, options } = body;

    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        { error: 'Invalid request. Question and at least 2 options are required.' },
        { status: 400 }
      );
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        options,
      },
    });

    const response: CreatePollResponse = {
      pollId: poll.id,
      votingUrl: `/poll/${poll.id}`,
      resultsUrl: `/poll/${poll.id}/results`,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    );
  }
}
export interface Poll {
  id: string;
  question: string;
  options: string[];
  createdAt: Date;
}

export interface Vote {
  id: string;
  pollId: string;
  selectedOption: string;
  votedAt: Date;
}

export interface CreatePollRequest {
  question: string;
  options: string[];
}

export interface CreatePollResponse {
  pollId: string;
  votingUrl: string;
  resultsUrl: string;
}

export interface PollResponse {
  question: string;
  options: string[];
}

export interface VoteRequest {
  selectedOption: string;
}

export interface PollResults {
  question: string;
  options: string[];
  voteCounts: Record<string, number>;
}
import { useState, useCallback, useEffect } from "react";

export interface RankingEntry {
  id: string;
  playerName: string;
  score: number;
  date: string;
}

interface RankingHook {
  rankings: RankingEntry[];
  canAddScore: (score: number) => boolean;
  addScore: (playerName: string, score: number) => void;
  clearRankings: () => void;
}

const RANKING_STORAGE_KEY = "aircraft-defense-rankings";
const MAX_RANKINGS = 5;

/**
 * Custom hook for managing game rankings
 * - Stores top 5 scores in localStorage
 * - Validates if a score qualifies for the ranking
 * - Provides functions to add new scores and clear rankings
 */
export const useRanking = (): RankingHook => {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);

  // Load rankings from localStorage on mount
  useEffect(() => {
    try {
      const storedRankings = localStorage.getItem(RANKING_STORAGE_KEY);
      if (storedRankings) {
        const parsedRankings = JSON.parse(storedRankings);
        setRankings(parsedRankings);
      }
    } catch (error) {
      console.error("Error loading rankings from localStorage:", error);
    }
  }, []);

  // Save rankings to localStorage whenever rankings change
  useEffect(() => {
    try {
      localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(rankings));
    } catch (error) {
      console.error("Error saving rankings to localStorage:", error);
    }
  }, [rankings]);

  const canAddScore = useCallback((score: number): boolean => {
    // If we have less than 5 rankings, any score can be added
    if (rankings.length < MAX_RANKINGS) {
      return true;
    }

    // If we have 5 rankings, score must be higher than the lowest (5th place)
      const lowestScore = Math.min(...rankings.map((r: RankingEntry) => r.score));
    return score > lowestScore;
  }, [rankings]);

  const addScore = useCallback((playerName: string, score: number) => {
    const newEntry: RankingEntry = {
      id: Date.now().toString(),
      playerName: playerName.trim(),
      score,
      date: new Date().toLocaleDateString(),
    };

    setRankings((prevRankings: RankingEntry[]) => {
      // Add new entry and sort by score (descending)
      const updatedRankings = [...prevRankings, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_RANKINGS); // Keep only top 5

      return updatedRankings;
    });
  }, []);

  const clearRankings = useCallback(() => {
    setRankings([]);
    localStorage.removeItem(RANKING_STORAGE_KEY);
  }, []);

  return {
    rankings,
    canAddScore,
    addScore,
    clearRankings,
  };
};
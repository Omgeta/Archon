import fs from "fs";
import leaderboard from "../assets/json/leaderboard.json";

interface LeaderboardRow {
    Ranking: number;
    Discord: string;
    Screenshots: string;
    Guarantee: number;
    Total: number;
}

export default class LeaderboardManager {
    private _leaderboard: LeaderboardRow[] = leaderboard;

    public get leaderboard(): LeaderboardRow[] {
        return this._leaderboard;
    }

    public set leaderboard(leaderboard: LeaderboardRow[]) {
        if (leaderboard.some(e => e.Ranking < 0 || e.Total < 0)) {
            throw new Error("Values for leaderboard cannot be negative");
        }

        fs.writeFile("../assets/json/leaderboard.json", JSON.stringify(leaderboard), err => {
            if (err) throw err;
            console.log("Leaderboard updated.");
        });

        this._leaderboard = leaderboard;
    }

    public findUser(username: string): LeaderboardRow {
        for (const row of this._leaderboard) {
            if (row.Discord === username) return row;
        }
    }
}
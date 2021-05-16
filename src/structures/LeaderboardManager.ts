import fs from "fs";
import leaderboard from "../assets/json/leaderboard.json";
import { User } from "discord.js";
import { Client } from "discord.js";

interface LeaderboardRow {
    Ranking: number;
    Discord: string;
    DiscordId?: string;
    Screenshots: string;
    Guarantee: number;
    Total: number;
}

export default class LeaderboardManager {
    private _client: Client;
    private _leaderboard: LeaderboardRow[];
    public constructor(client: Client) {
        this._client = client;
        this.leaderboard = leaderboard;
    }

    public get leaderboard(): LeaderboardRow[] {
        return this._leaderboard;
    }

    public set leaderboard(leaderboard: LeaderboardRow[]) {
        if (leaderboard.some(e => e.Ranking < 0 || e.Total < 0)) {
            throw new Error("Values for leaderboard cannot be negative");
        }

        // Adding UserIds
        for (const leaderboardRow of leaderboard) {
            if (!leaderboardRow.DiscordId) {
                const discordUser = this._client.users.cache.find(user => user.tag === leaderboardRow.Discord);
                if (discordUser) leaderboardRow.DiscordId = discordUser.id;
            }
        }

        // temp
        if (this._leaderboard !== leaderboard) {
            this._leaderboard = leaderboard;
            this.updateJSON();
        }

    }

    private async updateJSON() {
        fs.writeFile(__dirname + "/../assets/json/leaderboard.json", JSON.stringify(this.leaderboard, null, 2), err => {
            if (err) throw err;
            console.log("Leaderboard updated.");
        });
    }

    public findUser(user: User): LeaderboardRow {
        const username = user.tag.toLowerCase();
        const userid = user.id;
        for (const row of this._leaderboard) {
            if (row.Discord.toLowerCase() === username || row.DiscordId === userid) return row;
        }
    }
}
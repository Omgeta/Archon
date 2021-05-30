import fs from "fs";
import leaderboard from "../assets/json/leaderboard.json";
import { User } from "discord.js";
import { AkairoClient } from "discord-akairo";

interface LeaderboardRow {
    Ranking: number;
    Discord: string;
    DiscordId?: string;
    Screenshots: string;
    Guarantee: number;
    Total: number;
}

export default class LeaderboardManager {
    private _client: AkairoClient;
    private _data: LeaderboardRow[];
    public constructor(client: AkairoClient) {
        this._client = client;
        this.data = leaderboard;
    }

    public get data(): LeaderboardRow[] {
        return this._data;
    }

    public set data(newData: LeaderboardRow[]) {
        if (newData.some(e => e.Ranking < 0 || e.Total < 0)) {
            throw new Error("Values for leaderboard cannot be negative");
        }

        // Adding UserIds
        for (const row of newData) {
            if (!row.DiscordId) {
                const discordUser = this._client.users.cache.find(user => user.tag === row.Discord);
                if (discordUser) row.DiscordId = discordUser.id;
            }
        }

        if (this._data !== newData) {
            this._data = newData;
            this.updateJSON();
            this._client.log.info("Leaderboard modified.");
        }
    }

    private async updateJSON() {
        fs.writeFile(__dirname + "/../../src/assets/json/leaderboard.json", JSON.stringify(this.data, null, 2), err => {
            if (err) throw err;
        });
    }

    public findUser(user: User): LeaderboardRow {
        const username = user.tag.toLowerCase();
        const userid = user.id;
        for (const row of this.data) {
            if (row.Discord.toLowerCase() === username || row.DiscordId === userid) return row;
        }
    }

    public toString(): string {
        let cons = 1e9;

        let res = "";
        for (const row of this.data) {
            const currCon = Math.floor(row.Total / 28800);
            if (currCon < cons) {
                if (currCon >= 0) res += `__**C${currCon}**__\n\n`;
                else res += "__**No Guarantee**__\n\n";
                cons = currCon;
            }

            res += `${row.Ranking}. **${row.Discord}** - ${row.Total}/${28800 * (currCon + 1)}\n\n`;
        }

        return res;
    }
}
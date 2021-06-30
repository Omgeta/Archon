import fs from "fs";
import leaderboard from "../assets/json/leaderboard.json";
import { User } from "discord.js";
import { AkairoClient } from "discord-akairo";
import { partitionArray } from "../";

interface LeaderboardRow {
    Discord: string;
    DiscordId?: string;
    Fate: number;
    Primogems: number;
    Pity: number;
    Guarantee: number;
    GenesisCrystals: number;
    Whale: boolean;
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
        // Adding UserIds
        for (const row of newData) {
            if (!row.DiscordId) {
                const discordUser = this._client.users.cache.find(user => user.tag.toLowerCase() === row.Discord.toLowerCase());
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

    public findUser(user: User): [number, LeaderboardRow] {
        const username = user.tag.toLowerCase();
        const userid = user.id;
        for (const row of this.data) {
            if (row.Discord.toLowerCase() === username || row.DiscordId === userid) {
                const [paidCategory, freeCategory] = this.getCategories();
                const rank = row.Whale ? paidCategory.findIndex(r => r === row) : freeCategory.findIndex(r => r === row);

                return [rank, row];
            }
        }
    }

    public getCategories(): LeaderboardRow[][] {
        const sorted = LeaderboardManager.quickSort(this.data);
        const [paidCategory, freeCategory] = partitionArray(sorted, (row: LeaderboardRow) => { return row.Whale; });
        return [paidCategory, freeCategory];
    }

    public static calculateTotal(row: LeaderboardRow): number {
        const { Fate, Primogems, Pity, Guarantee, GenesisCrystals } = row;
        const total = (Fate + Pity + Guarantee * 90) * 160 + Primogems + GenesisCrystals;
        return total;
    }

    public static quickSort(rows: LeaderboardRow[]): LeaderboardRow[] {
        if (rows.length > 1) {
            const pivot = rows[rows.length - 1];
            let [ltePivot, gtPivot]: LeaderboardRow[][] = [[], []];

            for (let i = 0; i < rows.length - 1; i++) {
                if (LeaderboardManager.calculateTotal(rows[i]) <= LeaderboardManager.calculateTotal(pivot)) {
                    ltePivot.push(rows[i]);
                } else {
                    gtPivot.push(rows[i]);
                }
            }

            ltePivot = LeaderboardManager.quickSort(ltePivot);
            gtPivot = LeaderboardManager.quickSort(gtPivot);

            return [...gtPivot, pivot, ...ltePivot];
        } else {
            return rows;
        }
    }

    public static toString(category: LeaderboardRow[]): string {
        let cons = 1e9;

        let res = "";
        for (let i = 0; i < category.length; i++) {
            const row = category[i];
            const total = LeaderboardManager.calculateTotal(row);
            const currCon = Math.floor(total / 28800);
            if (currCon < cons) {
                if (currCon >= 0) res += `__**C${currCon}**__\n\n`;
                else res += "__**No Guarantee**__\n\n";
                cons = currCon;
            }

            res += `${i + 1}. **${row.Discord}** - ${total}/${28800 * (currCon + 1)}\n\n`;
        }

        return res;
    }
}
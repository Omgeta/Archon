class PityNode {
    private _con: number;
    private _guarantee: boolean;
    private _prob: number;
    public constructor(con: number, guarantee: boolean, prob: number) {
        this._con = con;
        this._guarantee = guarantee;
        this._prob = prob;
    }

    public get con(): number {
        return this._con;
    }

    public get guarantee(): boolean {
        return this._guarantee;
    }

    public get prob(): number {
        return this._prob;
    }

    public next(): PityNode[] {
        if (this.guarantee) {
            return [new PityNode(this.con + 1, false, this.prob)];
        } else {
            return [new PityNode(this.con, true, this.prob * 0.5), new PityNode(this.con + 1, false, this.prob * 0.5)];
        }
    }
}

export default class PityCalculator {
    private final(pity: number): PityNode[] {
        const currNode = new PityNode(-1, false, 1.0);
        let res = [currNode];

        for (let i = 0; i < pity; i++) {
            const temp = [];
            for (const node of res) {
                temp.push(...node.next());
            }
            res = temp;
        }

        return res;
    }

    public calculate(pity: number): Record<number, number> {
        const x = this.final(pity);
        const counts = {};

        for (const node of x) {
            counts[node.con] = node.con in counts ? counts[node.con] + node.prob : node.prob;
        }

        return counts;
    }
}
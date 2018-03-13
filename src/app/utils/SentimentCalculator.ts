export class SentimentCalculator {
    /**
     * 计算简单情绪指数 SSI（Simple Sentiment index）
     *
     * @positives 正向观点数
     * @negatives 负向观点数
     * @return 返回简单情绪指数 SSI（Simple Sentiment index）
     */
    public static calSSI(positives: Array<number>, negatives: Array<number>): Array<number> {
        if (positives.length !== negatives.length) {
            return null;
        }

        let ssi: Array<number> = [];
        for (let i: number = 0; i < positives.length; i++) {
            ssi.push(positives[i] - negatives[i])
        }

        return ssi;
    }

    /**
     * 计算看涨指数 BI（Bullishness index），范围 [-1, 1]
     *
     * @positives 正向观点数
     * @negatives 负向观点数
     * @return 计算看涨指数 BI（Bullishness index），范围 [-1, 1]
     */
    public static calBI(positives: Array<number>, negatives: Array<number>): Array<number> {
        if (positives.length !== negatives.length) {
            return null;
        }

        const limit: number = 1.6;
        let bi: Array<number> = [];
        for (let i: number = 0; i < positives.length; i++) {
            let index: number = Math.log((1 + positives[i]) / (1 + negatives[i]))
            if (index > limit) {
                index = limit;
            }
            if (index < -limit) {
                index = -limit;
            }
            index = index / limit;
            bi.push(index);
        }

        return bi;
    }
}
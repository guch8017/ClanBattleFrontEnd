const hpList = [
    [6000000, 8000000, 10000000, 12000000, 15000000],
    [6000000, 8000000, 10000000, 12000000, 15000000],
    [7000000, 9000000, 13000000, 15000000, 20000000],
    [15000000, 16000000, 18000000, 19000000, 20000000]
];
const rateList = [
    [1.2, 1.2, 1.3, 1.4, 1.5],
    [1.6, 1.6, 1.8, 1.9, 2.0],
    [2.0, 2.0, 2.4, 2.4, 2.6],
    [3.5, 3.5, 3.7, 3.8, 4.0]
];
const scoreList = [];
const lapScoreList = [];
for(let i = 0; i < 4; ++i){
    const scores = [];
    let lapScore = 0
    for(let j = 0; j < 5; ++j){
        const score = hpList[i][j] * rateList[i][j];
        scores.push(score);
        lapScore += score;
    }
    scoreList.push(scores);
    lapScoreList.push(lapScore)
}

function getPeriod(lap){
    return (lap < 5) ? 0 :
        (lap < 11) ? 1 :
            (lap < 35) ? 2 :
                3;
}
export function getClanBattleProgress(score){
    /**
     * @param score 分数
     * @return [lap, boss, hp, maxHP] [周目, 王]
     */
    if(!Number.isInteger(score)){
        return [0, 0, 0, 0]
    }
    let lap = 1;
    let boss;
    let cur = 0;
    while (true){
        const period = getPeriod(lap);
        cur += lapScoreList[period];
        if(cur === score){
            break;
        }
        if(cur > score){
            cur -= lapScoreList[period];
            break;
        }
        lap += 1;
    }
    const period = getPeriod(lap);
    for(boss = 0; boss < 5; ++boss){
        cur += scoreList[period][boss];
        if(cur === score){
            break;
        }else if(cur > score){
            cur -= scoreList[period][boss];
            break;
        }
    }
    return [lap, boss+1, ((score - cur)/rateList[period][boss]) ,hpList[period][boss]];
}
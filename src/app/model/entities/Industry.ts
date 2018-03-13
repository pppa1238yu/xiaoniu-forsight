export class Industry {
    code: string;
    name: string;
    rank?: number;
    englishName: string;
    firstInitial?: string;
    parentIndustry?:{
        code: string;
        name: string;
        rank?: number;
        englishName: string;
        firstInitial?: string;
        parentIndustry?:{
            code: string;
            name: string;
            rank?: number;
            englishName: string;
            firstInitial?: string;
        }
    }
}
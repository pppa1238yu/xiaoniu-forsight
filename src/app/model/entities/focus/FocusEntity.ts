export class FocusEntity {
    analyst:{
        beginSecurityYear:number;
        certificate:string;
        degree:string;
        degreeId:string;
        fullName:string;
        gender:string;
        gtaCsrcPersonMapping?:{
            csrcInfo:{
                analystName:string;
                brokerageName:string;
                certificateNumber:string;
            },
            researcher:object;
        };
        gtaId:string;
        score:number;
        source:string;
        viewPointCount:number;
    };
    userId:string;
}
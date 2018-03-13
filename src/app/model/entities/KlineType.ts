export enum KlineType {
    FOWARDADJ_DAY,//日K前复权
    DAY,//日K不复权
    BACKWARDADJ_DAY,//日K后复权
    FOWARDADJ_WEEK,//周K前复权
    WEEK,//周K不复权
    BACKWARDADJ_WEEK,//周K后复权
    FOWARDADJ_MONTH,//月K前复权
    MONTH,//月K不复权
    BACKWARDADJ_MONTH,//月K后复权
    IDXH,//国内股指
    IDXH_WEEK,//国内指数周K
    IDXH_MONTH,//国内指数月K
    IDXI,//国际股指
    IDXI_WEEK,//国际指数周K
    IDXI_MONTH//国际指数月K
}
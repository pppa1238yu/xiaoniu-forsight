/*
 * ======================================================================
 * numberFormat.js
 * Copyright (c) 2016 Chengdu Lanjing Data&Information Co., Ltd
 *
 * =======================================================================
 */
import {EntityType} from "../model/entities/EntityType";
import Constants from "../Constants";
export class ImageUrl {

    private static readonly attchServer: string = Constants.imageBaseUrl;

    static defaultImg = [
        'images/avatar_user.png',
        'images/avatar_analyst.png',
        'images/avatar_stock.png',
        'images/noDataIndustry.jpg',
        '/images/noDataSubject.jpg',
        '/images/noDataIndustry.jpg',
        '/images/hotOpportunity/defaultHotOpp.jpg'
    ];

    static getImageUrl(entityType: EntityType, imageId:string) {
        return imageId ? ImageUrl.attchServer + imageId : ImageUrl.defaultImg[entityType];
    }
}

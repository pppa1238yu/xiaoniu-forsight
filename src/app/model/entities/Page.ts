export class Page<E> {

    pageIndex: number = 0;

    pageSize: number = 0;

    pageCount: number = 0;

    totalRowCount: number = 0;

    entities: Array<E> = [];
}
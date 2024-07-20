export interface GetListFloorResponse
{
    id: number;
    no: string;
}
export interface GetListRoomResponse
{
    id: number;
    no: string;
}
export interface GetListBlockResponse
{
    id: number;
    no: string;
}

export interface GetListOfficeLocationResponse
{
    id: number;
    blockNo: string;
    floorNo: string;
    roomNo: string;
    blockId: number;
    floorId: number;
    roomId: number;
}
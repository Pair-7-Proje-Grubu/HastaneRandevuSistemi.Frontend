export interface CancelAppointmentFromDoctorResponse{
    id: number;
    patient: string;
    dateTime: Date;
    isCancelStatus: IsCancelStatus
}

export enum IsCancelStatus{
    NoCancel = 0,
    FromDoctor = 1,
    FromPatient = 2,
}
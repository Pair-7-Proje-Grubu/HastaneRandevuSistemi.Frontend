export interface GetListAllAppointmentResponse {
    id: number;
    patientName: string;
    doctorName: string;
    clinicName: string;
    dateTime: Date;
    status: string;
}
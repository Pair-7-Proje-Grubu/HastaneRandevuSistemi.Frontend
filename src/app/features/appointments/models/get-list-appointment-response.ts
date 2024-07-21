export interface GetListAppointmentResponse{
  id: number;
  dateTime: Date;
  doctor: string;
  clinic: string;
  officeLocation: string;
  status: string;
}
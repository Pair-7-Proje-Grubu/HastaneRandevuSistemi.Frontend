export interface CreateNoWorkHourRequest {
  DoctorId: number;
  NoWorkHours: NoWorkHour[]
}

export interface NoWorkHour{
  id: number;
  startDate: Date;
  endDate: Date;
  title: string
}
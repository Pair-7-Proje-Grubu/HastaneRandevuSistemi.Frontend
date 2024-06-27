export interface CreateNoWorkHourRequest {
  DoctorId: number;
  NoWorkHours: NoWorkHour[]
}

export interface NoWorkHour{
  startDate: Date;
  endDate: Date
}
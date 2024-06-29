export interface ListAvailableAppointmentResponse{
  appointmentDuration : number;
  appointmentDates : AppointmentDate[];
}

export interface AppointmentDate {
  date: string;
  bookedSlots: string[];
  ranges: DateRange[];
  slots: Slot[];

}

export interface DateRange {
  startTime: string;
  endTime: string;
}
export interface Slot {
  hour:string;
  times:string[];
}
export interface GetAllPatientResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    gender: string;
    bloodType?: string;
    emergencyContact?: string;
}
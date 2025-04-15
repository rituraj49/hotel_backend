import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateReservationDto {
    @IsNotEmpty()
    reservationId: number;

    @IsDate()
    @IsOptional()
    @Transform(({ value}) => new Date(value))
    checkInDate: Date;

    @IsDate()
    @IsOptional()
    @Transform(({ value}) => new Date(value))
    checkOutDate: Date;

    @IsOptional()
    @IsNumber()
    adults: number;

    @IsOptional()
    @IsNumber()
    children: number;

    @IsOptional()
    guestNames: string[];

}
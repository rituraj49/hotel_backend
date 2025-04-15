import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReservationDto {
    @IsNumber()
    @IsNotEmpty()
    roomId: number;
    
    @IsNumber()
    @IsNotEmpty()
    guestId: number;

    @IsDate()
    @IsNotEmpty()
    @Transform(({ value}) => new Date(value))
    checkInDate: Date;

    @IsDate()
    @IsNotEmpty()
    @Transform(({ value}) => new Date(value))
    checkOutDate: Date;

    @IsNotEmpty()
    @IsNumber()
    adults: number;

    @IsNotEmpty()
    @IsNumber()
    children: number;

    @IsNotEmpty()
    guestNames: string[];

    // @IsNumber()
    // paymentId: number;

    @IsNotEmpty()
    amount: number;
}
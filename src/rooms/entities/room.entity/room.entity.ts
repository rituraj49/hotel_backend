import { RoomType } from "src/enums/rommTypes";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        // type: 'enum',
        // enum: RoomType,
    })
    type: string;

    @Column()
    price: number;

    @Column()
    location: string;

    @Column()
    occupancy: number;
    
    @Column()
    isAvailable: boolean;

    @CreateDateColumn()
        createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;

}

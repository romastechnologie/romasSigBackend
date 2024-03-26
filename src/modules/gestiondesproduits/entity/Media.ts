import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity()
export class Media{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    photo:string

    @Column()
    nomMedia:string

    @Column()
    typeMedia:string

    @Column()
    extension:string

    @Column()
    idtable:number

    @Column()
    nomTable:string
   
    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}
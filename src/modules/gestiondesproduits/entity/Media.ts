import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity()
export class Media{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:true})
    photo:string

    @Column({nullable:true})
    nomMedia:string

    @Column({nullable:true})
    typeMedia:string

    @Column({nullable:true})
    extension:string

    @Column({nullable:true})
    idtable:number

    @Column({nullable:true})
    nomTable:string
   
    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}
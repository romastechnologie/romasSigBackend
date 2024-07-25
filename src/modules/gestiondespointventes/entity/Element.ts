import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity()
export class Element{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:true})
    titre:string

    @Column({nullable:true})
    description:string

    @Column({nullable:true})
    taillePolice:number

    @Column({nullable:true})
    alignement:string

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}
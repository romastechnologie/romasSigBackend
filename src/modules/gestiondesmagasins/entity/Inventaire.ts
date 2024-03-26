import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProCondiMagInventaire } from "./ProCondiMagInventaire";

@Entity()
export class Inventaire{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    dateDebut:Date

    @Column()
    dateFin:Date

    @Column()
    periode:string

    @OneToMany(() => ProCondiMagInventaire, (inventaiprocondimag) => inventaiprocondimag.inventaire)
    inventaiprocondimags: ProCondiMagInventaire[]
    
    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}
import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProCondiMagInventaire } from "./ProCondiMagInventaire";

@Entity()
export class Inventaire{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"La date de début ne peut pas être nulle"})
    dateDebut:Date

    @Column({nullable:false})
    @IsNotEmpty({message:"La date de fin ne peut pas être nulle"})
    dateFin:Date

    @Column({nullable:false})
    @IsNotEmpty({message:"La période ne peut pas être nulle"})
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
import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Banque } from "./Banque";
import { PointVente } from "../../gestiondespointventes/entity/PointVente";

@Entity()
export class Societe{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le nom ne peut pas être nul"})
    nom:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le sigle ne peut pas être nul"})
    sigle:string

    @Column()
    adresse:string

    @Column()
    logo:string

    @Column({nullable:false})
    @IsNotEmpty({message:"La raison sociale ne peut pas être nulle"})
    raisonSocial:string

    @Column({nullable:false})
    @IsNotEmpty({message:"L' ifu ne peut pas être nul"})
    ifu:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le RCCCM ne peut pas être nul"})
    rccm:string

    @Column()
    statut:string

    @OneToMany(() => Banque, (banquesociete) => banquesociete.societe)
    banquesocietes: Banque[]

    @OneToMany(() => PointVente, (societepointvent) => societepointvent.societe)
    societepointvents: PointVente[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}
import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Banque } from "./Banque";
import { PointVente } from "../../gestiondespointventes/entity/PointVente";

@Entity()
export class Societe{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le nom est obligatoire."})
    denomination:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le sigle est obligatoire."})
    sigle:string

    @Column({nullable:true})
    adresse:string

    @Column({nullable:true})
    logo:string

    @Column({nullable:true})
    apNim:string

    @Column({nullable:true})
    lienApi:string

    @Column({nullable:true})
    lieuImpression:string

    @Column({nullable:true})
    apiToken:string
    
    @Column({nullable:true})
    messageCommercial:string

    @Column({nullable:false})
    @IsNotEmpty({message:"La raison sociale est obligatoire."})
    raisonSocial:string

    @Column({nullable:false})
    @IsNotEmpty({message:"L' ifu est obligatoire."})
    ifu:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le RCCCM est obligatoire."})
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
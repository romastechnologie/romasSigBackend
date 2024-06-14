import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { DemandePrix } from "../../gestiondesapprovisionnements/entity/DemandePrix";
import { CommandeFournisseur } from "../../gestiondesapprovisionnements/entity/CommandeFournisseur";
import { Compte } from "../../gestiondesportefeuille/entity/Compte";
import { Approvisionnement } from "../../gestiondesapprovisionnements/entity/Approvisionnement";

@Entity()
export class Fournisseur{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le nom du fournisseur est obligatoire."})
    nomFournisseur:string

    @Column({nullable:true})
    adresseFournisseur:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le numéro de téléphone est obligatoire."})
    telFournisseur1:number

    @OneToMany(() => DemandePrix, (fournisseurdemandpri) => fournisseurdemandpri.fournisseur)
    fournisseurdemandprix: DemandePrix[]

    @OneToMany(() => CommandeFournisseur, (fournisseurcommande) => fournisseurcommande.fournisseur)
    fournisseurcommandes: CommandeFournisseur[]

    @OneToMany(() => Compte, (comptefournisseur) => comptefournisseur.fournisseur)
    comptefournisseurs: Compte[]

    @OneToMany(() => Approvisionnement, (approvisionnement) => approvisionnement.fournisseur)
    approvisionnements: Approvisionnement[]

    @Column({nullable:true})
    telFournisseur2:number

    @Column({nullable:true})
    email:string

    @Column({nullable:false})
    @IsNotEmpty({message:"L'ifu est obligatoire."})
    ifu:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le sigle est obligatoire."})
    sigle:string

    @Column({nullable:false})
    @IsNotEmpty({message:"La dénomination est obligatoire."})
    denomination:string

    @Column({nullable:false})
    @IsNotEmpty({message:"La date est obligatoire."})
    dateCreation:Date

    @Column()
    statut:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le RCCM est obligatoire."})
    rccm:string

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}
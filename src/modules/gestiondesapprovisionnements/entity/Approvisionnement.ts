import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Fournisseur } from "../../gestiondesfournisseurs/entity/Fournisseur";
import { DemandePrixProCondi } from "./DemandePrixProCondi";
import { CommandeFournisseur } from "./CommandeFournisseur";
import { AProCondi } from "./AProCondi";

@Entity()
export class Approvisionnement{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    montantTotal:number

    @Column({nullable:true})
    refAppro:string

    @Column({ nullable: true})
    // @Column({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    dateAppro:Date

    @ManyToOne(()=>CommandeFournisseur, (commandefournisseur)=>commandefournisseur.aprovisioncommandefournis)
    @JoinColumn()
    commandefournisseur:CommandeFournisseur[]

    @OneToMany(() => AProCondi, (apropocondi) => apropocondi.approvision)
    apropocondis: AProCondi[]
    
    @ManyToOne(()=>Fournisseur, (fournisseur)=>fournisseur.approvisionnements)
    @JoinColumn()
    fournisseur:Fournisseur[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}
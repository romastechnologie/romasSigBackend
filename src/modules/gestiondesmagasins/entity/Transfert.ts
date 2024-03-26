import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Magasin } from "./Magasin";
import { ProCondiTrans } from "./ProCondiTrans";
import { Paiement } from "../../gestiondesfactures/entity/Paiement";

@Entity()
export class Transfert{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    motif:string

    @Column()
    date:Date

    @Column()
    montant:number

    @ManyToOne(()=>Magasin, (magasin1)=>magasin1.magasintransferts1)
    @JoinColumn()
    magasin1:Magasin[]

    @ManyToOne(()=>Magasin, (magasin2)=>magasin2.magasintransferts2)
    @JoinColumn()
    magasin2:Magasin[]

    @OneToMany(() => ProCondiTrans, (magasinaprocondi) => magasinaprocondi.transfert)
    transfertprocondis: ProCondiTrans[]

    @OneToMany(() => Paiement, (transfpaiement) => transfpaiement.transfert)
    transfpaiements: Paiement[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}
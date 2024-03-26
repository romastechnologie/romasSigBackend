import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Magasin } from "./Magasin";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";
import { ProCondiMagInventaire } from "./ProCondiMagInventaire";
import { Transfert } from "./Transfert";

@Entity()
export class ProCondiTrans{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    qtite:number

    @ManyToOne(()=>Transfert, (transfert)=>transfert.transfertprocondis)
    @JoinColumn()
    transfert:Transfert[]

    @ManyToOne(()=>ProduitConditionnement, (produitcondi)=>produitcondi.proconditransferts)
    @JoinColumn()
    produitcondi:ProduitConditionnement[]
    
    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}
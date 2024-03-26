import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Produit } from "./Produit";

@Entity()
export class Famille{
    @PrimaryGeneratedColumn()
    id:number

    @Column({unique: true})
    codeFamille:string

    @Column()
    @IsAlpha()
    libelleFamille:string
   
    @OneToMany(() => Produit, (produit) => produit.famille)
    produits: Produit[]
    
    @ManyToOne(()=>Famille, famille=>famille.familles)
    @JoinColumn()
    famille:Famille

    @OneToMany(()=>Famille, (famille)=>famille.famille)
    familles:Famille[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}
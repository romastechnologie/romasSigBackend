import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";
import { CommandeClient } from "../../gestiondesclients/entity/CommandeClient";
import { Societe } from "../../gestiondesportefeuille/entity/Societe";
import { Personnel } from "../../gestiondupersonnel/entity/Personnel";
import { Client } from "../../gestiondesclients/entity/Client";
import { Produit } from "../../gestiondesproduits/entity/Produit";

@Entity()
export class Vente{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le nom du point de vente est obligatoire."})
    nomPointVente:string
    
    @Column({nullable:true})
    typeCommande:string

    @Column({nullable:true})
    typeFacture:string

    @Column({nullable:true})
    tauxAIB:string

    @Column({nullable:true})
    montantRecu:number

    @OneToMany(() => Client, (client) => client.vente)
    clients: Client[]

    @ManyToMany(() => Produit, (produit) => produit.ventes)
    @JoinTable()
    produitventes: Produit[]

    // @ManyToOne(()=>Personnel, (personnel)=>personnel.personelpointvents)
    // @JoinColumn()
    // personnel:Personnel[]

    @ManyToOne(()=>Societe, (societe)=>societe.societepointvents)
    @JoinColumn()
    societe:Societe[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}
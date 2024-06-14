import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Fournisseur } from "../../gestiondesfournisseurs/entity/Fournisseur";
import { Personnel } from "../../gestiondupersonnel/entity/Personnel";
import { Transfert } from "./Transfert";
import { ProCondiMagasin } from "./ProCondiMagasin";
import { Produit } from "../../gestiondesproduits/entity/Produit";

@Entity()
export class Magasin{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le nom du magasin est obligatoire."})
    nomMagasin:string

    @Column({nullable:true})
    adresse:string

    @ManyToOne(()=>Personnel, (personnel)=>personnel.personnelmagasins)
    @JoinColumn()
    personnel:Personnel[]

    @OneToMany(() => Transfert, (magasintransfert) => magasintransfert.magasin1)
    magasintransferts1: Transfert[]

    @OneToMany(() => Transfert, (magasintransfert) => magasintransfert.magasin2)
    magasintransferts2: Transfert[]

    @OneToMany(() => ProCondiMagasin, (magasinprocondi) => magasinprocondi.magasin)
    magasinprocondis: ProCondiMagasin[]

    @OneToMany(() => ProCondiMagasin, (magasinaprocondi) => magasinaprocondi.magasin)
    magasinaprocondis: ProCondiMagasin[]

    @OneToMany(() => Produit, (produit) => produit.magasin)
    produits: Produit[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}
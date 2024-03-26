import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Magasin } from "./Magasin";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";
import { ProCondiMagInventaire } from "./ProCondiMagInventaire";

@Entity()
export class ProCondiMagasin{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    qtite:number

    @ManyToOne(()=>Magasin, (magasin)=>magasin.magasinprocondis)
    @JoinColumn()
    magasin:Magasin[]

    @ManyToOne(()=>ProduitConditionnement, (produitcondi)=>produitcondi.procondiaprovisions)
    @JoinColumn()
    produitcondi:ProduitConditionnement[]

    @OneToMany(() => ProCondiMagInventaire, (procondimaginventaire) => procondimaginventaire.procondimag)
    procondimaginventaires: ProCondiMagInventaire[]
    
    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}